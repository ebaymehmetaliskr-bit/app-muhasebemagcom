


import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisData, DetailedTaxReportItem, VergiselAnalizItem } from '../types';

// Schemas for sub-types
const pieChartDataSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Chart item name" },
        value: { type: Type.NUMBER, description: "Chart item value" }
    },
    required: ['name', 'value']
};

const barChartDataSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Bar chart item name" },
        'Cari Dönem': { type: Type.NUMBER, description: "Current period value" },
        'Önceki Dönem': { type: Type.NUMBER, description: "Previous period value" }
    },
    required: ['name', 'Cari Dönem', 'Önceki Dönem']
};

const dashboardSummarySchema = {
    type: Type.OBJECT,
    properties: {
        mizan: { type: Type.NUMBER, description: "Number of trial balance accounts" },
        bilanco: { type: Type.NUMBER, description: "Number of balance sheet accounts" },
        gelirGider: { type: Type.NUMBER, description: "Number of income statement accounts" },
        analizler: { type: Type.NUMBER, description: "Number of analysis points" }
    },
    required: ['mizan', 'bilanco', 'gelirGider', 'analizler']
};

const mizanItemSchema = {
    type: Type.OBJECT,
    properties: {
        hesapKodu: { type: Type.STRING, description: "Account code" },
        hesapAdi: { type: Type.STRING, description: "Account name" },
        oncekiDonem: { type: Type.NUMBER, description: "Previous period amount" },
        cariDonem: { type: Type.NUMBER, description: "Current period amount" },
        isMain: { type: Type.BOOLEAN, description: "Is a main account group" },
        isSub: { type: Type.BOOLEAN, description: "Is a sub-account group" }
    },
    required: ['hesapKodu', 'hesapAdi', 'oncekiDonem', 'cariDonem', 'isMain', 'isSub']
};

const bilancoStokSchema = {
    type: Type.OBJECT,
    properties: {
        aciklama: { type: Type.STRING, description: "Account description" },
        oncekiDonem: { type: Type.NUMBER, description: "Previous period amount" },
        cariDonem: { type: Type.NUMBER, description: "Current period amount" }
    },
    required: ['aciklama', 'oncekiDonem', 'cariDonem']
};

const bilancoBolumSchema = {
    type: Type.OBJECT,
    properties: {
        bolumAdi: { type: Type.STRING, description: "Section name (e.g., 'I. Dönen Varlıklar')" },
        stoklar: { type: Type.ARRAY, items: bilancoStokSchema, description: "List of accounts in this section" }
    },
    required: ['bolumAdi', 'stoklar']
};

const bilancoDataSchema = {
    type: Type.OBJECT,
    properties: {
        aktif: { type: Type.ARRAY, items: bilancoBolumSchema, description: "Assets section of the balance sheet" },
        pasif: { type: Type.ARRAY, items: bilancoBolumSchema, description: "Liabilities and Equity section of the balance sheet" }
    },
    required: ['aktif', 'pasif']
};

const gelirGiderItemSchema = {
    type: Type.OBJECT,
    properties: {
        aciklama: { type: Type.STRING, description: "Account description" },
        oncekiDonem: { type: Type.NUMBER, description: "Previous period amount" },
        cariDonem: { type: Type.NUMBER, description: "Current period amount" }
    },
    required: ['aciklama', 'oncekiDonem', 'cariDonem']
};

const rasyoItemSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Ratio name" },
        cariDonem: { type: Type.NUMBER, description: "Current period ratio value" },
        oncekiDonem: { type: Type.NUMBER, description: "Previous period ratio value" },
        formula: { type: Type.STRING, description: "The formula used to calculate the ratio" },
    },
    required: ['name', 'cariDonem', 'oncekiDonem']
};

const rasyoGrupSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Title of the ratio group" },
        ratios: { type: Type.ARRAY, items: rasyoItemSchema, description: "List of ratios in this group" }
    },
    required: ['title', 'ratios']
};

const rasyoDataSchema = {
    type: Type.OBJECT,
    properties: {
        finansalYapi: rasyoGrupSchema,
        likidite: {
            type: Type.OBJECT,
            properties: {
                ...rasyoGrupSchema.properties,
                dagilim: { type: Type.ARRAY, items: pieChartDataSchema }
            },
            required: [...rasyoGrupSchema.required, 'dagilim']
        },
        devirHizlari: {
            type: Type.OBJECT,
            properties: {
                ...rasyoGrupSchema.properties,
                karsilastirma: { type: Type.ARRAY, items: barChartDataSchema }
            },
            required: [...rasyoGrupSchema.required, 'karsilastirma']
        },
        karlilik: { type: Type.ARRAY, items: barChartDataSchema }
    },
    required: ['finansalYapi', 'likidite', 'devirHizlari', 'karlilik']
};

const vergiselAnalizItemSchema = {
    type: Type.OBJECT,
    properties: {
        hesapKodlari: { type: Type.ARRAY, items: { type: Type.STRING, description: "Related account code" } },
        baslik: { type: Type.STRING, description: "Title of the analysis point" },
        kategori: { type: Type.STRING, description: "The category of the tax risk." },
        durum: { type: Type.STRING, enum: ['Evet', 'Hayır'], description: "Status of the check ('Yes' or 'No')" },
        aciklama: { type: Type.STRING, description: "Detailed explanation of the analysis point, excluding legal references." },
        uyariMesaji: { type: Type.STRING, description: "A short, urgent warning tip (max 1-2 sentences) if 'durum' is 'Hayır', specific to the account codes. Omit if 'durum' is 'Evet'." },
        mevzuatReferanslari: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of relevant Turkish Tax Code articles (e.g., 'VUK Madde 323')." }
    },
    required: ['hesapKodlari', 'baslik', 'kategori', 'durum', 'aciklama']
};

const kurganKriterAnaliziSchema = {
    type: Type.OBJECT,
    properties: {
        kriterAdi: { type: Type.STRING },
        riskDurumu: { type: Type.STRING, enum: ['Düşük', 'Orta', 'Yüksek', 'Tespit Edilmedi'] },
        analizDetayi: { type: Type.STRING },
        ilgiliHesaplar: { type: Type.ARRAY, items: { type: Type.STRING } },
        mevzuatReferansi: { type: Type.STRING }
    },
    required: ['kriterAdi', 'riskDurumu', 'analizDetayi', 'ilgiliHesaplar', 'mevzuatReferansi']
};

const kurganAnalizSchema = {
    type: Type.OBJECT,
    properties: {
        genelRiskDurumu: { type: Type.STRING, enum: ['Düşük', 'Orta', 'Yüksek'] },
        riskOzeti: { type: Type.STRING },
        kriterAnalizleri: { type: Type.ARRAY, items: kurganKriterAnaliziSchema },
        aksiyonOnerileri: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['genelRiskDurumu', 'riskOzeti', 'kriterAnalizleri', 'aksiyonOnerileri']
};


const analysisDataSchema = {
    type: Type.OBJECT,
    properties: {
        dashboard: {
            type: Type.OBJECT,
            properties: {
                summary: dashboardSummarySchema,
                aktifYapi: { type: Type.ARRAY, items: pieChartDataSchema },
                pasifYapi: { type: Type.ARRAY, items: pieChartDataSchema }
            },
            required: ['summary', 'aktifYapi', 'pasifYapi']
        },
        mizan: {
            type: Type.ARRAY,
            items: mizanItemSchema
        },
        bilanco: bilancoDataSchema,
        gelirGider: {
            type: Type.ARRAY,
            items: gelirGiderItemSchema
        },
        rasyolar: rasyoDataSchema,
        vergiselAnaliz: {
            type: Type.ARRAY,
            items: vergiselAnalizItemSchema
        },
        gelirGiderAnalizi: {
            type: Type.ARRAY,
            items: barChartDataSchema
        },
        kurganAnalizi: kurganAnalizSchema
    },
    required: ['dashboard', 'mizan', 'bilanco', 'gelirGider', 'rasyolar', 'vergiselAnaliz', 'gelirGiderAnalizi', 'kurganAnalizi']
};


const financialTablesSchema = {
    type: Type.OBJECT,
    properties: {
        mizan: { type: Type.ARRAY, items: mizanItemSchema },
        bilanco: bilancoDataSchema,
        gelirGider: { type: Type.ARRAY, items: gelirGiderItemSchema },
    },
    required: ['mizan', 'bilanco', 'gelirGider']
};

const analysisPartSchema = {
    type: Type.OBJECT,
    properties: {
        dashboard: analysisDataSchema.properties.dashboard,
        rasyolar: rasyoDataSchema,
        vergiselAnaliz: { type: Type.ARRAY, items: vergiselAnalizItemSchema },
        gelirGiderAnalizi: { type: Type.ARRAY, items: barChartDataSchema },
        kurganAnalizi: kurganAnalizSchema,
    },
    required: ['dashboard', 'rasyolar', 'vergiselAnaliz', 'gelirGiderAnalizi', 'kurganAnalizi']
};

const nakitAkimItemSchema = {
    type: Type.OBJECT,
    properties: {
        aciklama: { type: Type.STRING },
        tutar: { type: Type.NUMBER },
        isSub: { type: Type.BOOLEAN },
    },
    required: ['aciklama', 'tutar', 'isSub']
};

const nakitAkimBolumSchema = {
    type: Type.OBJECT,
    properties: {
        bolumAdi: { type: Type.STRING },
        items: { type: Type.ARRAY, items: nakitAkimItemSchema },
        toplam: { type: Type.NUMBER },
    },
    required: ['bolumAdi', 'items', 'toplam']
};

const nakitAkimSchema = {
    type: Type.OBJECT,
    properties: {
        isletme: nakitAkimBolumSchema,
        yatirim: nakitAkimBolumSchema,
        finansman: nakitAkimBolumSchema,
        netArtis: { type: Type.OBJECT, properties: { aciklama: { type: Type.STRING }, tutar: { type: Type.NUMBER } }, required: ['aciklama', 'tutar'] },
        donemBasi: { type: Type.OBJECT, properties: { aciklama: { type: Type.STRING }, tutar: { type: Type.NUMBER } }, required: ['aciklama', 'tutar'] },
        donemSonu: { type: Type.OBJECT, properties: { aciklama: { type: Type.STRING }, tutar: { type: Type.NUMBER } }, required: ['aciklama', 'tutar'] },
    },
    required: ['isletme', 'yatirim', 'finansman', 'netArtis', 'donemBasi', 'donemSonu']
};

const detailedTaxReportItemSchema = {
    type: Type.OBJECT,
    properties: {
        baslik: { type: Type.STRING },
        riskAnalizi: { type: Type.STRING, description: "Detailed risk analysis. Do NOT include legal references here." },
        mevzuatReferanslari: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of relevant Turkish Tax Code articles (e.g., 'VUK Madde 323', 'KVK Madde 10')." },
        yapilmasiGerekenler: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable steps for compliance." },
        potansiyelVergiCezalari: { type: Type.STRING, description: "Details on potential fines (vergi ziyaı cezası) and late payment interest (gecikme faizi)." }
    },
    required: ['baslik', 'riskAnalizi', 'mevzuatReferanslari', 'yapilmasiGerekenler', 'potansiyelVergiCezalari']
};

const detailedTaxReportSchema = {
    type: Type.ARRAY,
    items: detailedTaxReportItemSchema
};


const makeApiCallInternal = async (stepName: string, schema: any, prompt: string, onProgress?: (message: string) => void) => {
    if(onProgress) onProgress(stepName);
    console.log(`Executing step: ${stepName}`);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                systemInstruction: `You are an AI financial analyst and tax expert specializing in Turkish Tax Law (VUK, KVK). You will extract, analyze financial data from text, and create reports, returning everything in a precise JSON format. Be robust against OCR errors.`,
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const responseText = response.text;
        if (!responseText || responseText.trim() === '') {
            throw new Error(`Yapay zeka boş bir yanıt döndürdü.`);
        }
        
        const cleanedText = responseText.replace(/^```json\s*|```\s*$/g, '').trim();
        const structuredData = JSON.parse(cleanedText);
        console.log(`Successfully completed step: ${stepName}`);
        return structuredData;

    } catch (error) {
        console.error(`Error during '${stepName}':`, error);
        const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
        if (errorMessage.includes("API key not valid")) {
             throw new Error(`Geçersiz API Anahtarı. Lütfen API anahtarınızı kontrol edin.`);
        }
        throw new Error(`'${stepName}' sırasında bir hata oluştu: ${errorMessage}`);
    }
};

export const performFullAnalysis = async (
    pdfText: string, 
    onProgress: (message: string) => void
): Promise<AnalysisData> => {
    console.log("Starting 3-step Gemini API analysis.");
    
    const tablesPrompt = `
        Analyze the following text from a Turkish Corporate Tax Return PDF.
        Your primary task is to find and extract the detailed financial statements, which are typically located in the 'EKLER' (Appendices) section under the heading "TEK DÜZEN HESAP PLANI AYRINTILI BİLANÇO VE AYRINTILI GELİR TABLOSU". Ignore the summary tables on the first few pages of the tax return form itself.

        Focus on these specific tables:
        1.  **Ayrıntılı Bilanço (Detailed Balance Sheet):**
            *   This table is divided into 'AKTİF' (Assets) and 'PASİF' (Liabilities & Equity) sections.
            *   Extract all accounts listed under both sections.
        2.  **Ayrıntılı Gelir Tablosu (Detailed Income Statement):**
            *   This is a separate table, usually found after the balance sheet.
            *   Extract all line items from this table.
        3.  **Mizan (Trial Balance):**
            *   Synthesize a Trial Balance (Mizan) from the detailed Bilanço and Gelir Tablosu accounts you've extracted. Group accounts logically. For main accounts set isMain=true, for sub-groups set isSub=true.

        For each account/item in these tables, capture the values for both the 'Önceki Dönem' (Previous Period) and 'Cari Dönem' (Current Period) columns.
        Return all this data in a single JSON object conforming to the provided schema. Do not perform any calculations or analysis yet, focus only on extraction and structuring.

        Text to analyze:
        ---
        ${pdfText}
        ---
    `;
    const tablesData = await makeApiCallInternal("Mali tablolar çıkarılıyor...", financialTablesSchema, tablesPrompt, onProgress);

    const analysisPrompt = `
        Based on the full text of a Turkish Corporate Tax Return provided below, perform a detailed financial analysis.
        **Crucially, base all your calculations and interpretations on the detailed financial statements (Ayrıntılı Bilanço and Ayrıntılı Gelir Tablosu) found within the 'EKLER' (Appendices) section of the document, not the high-level summary figures on the first pages.**

        Your task is to calculate and generate the following analytical components:
        1.  **Dashboard Summary:** Create a summary for the dashboard.
        2.  **Financial Ratios (Rasyolar):** Calculate all required financial ratios.
        3.  **Tax Analysis (Vergisel Analiz):** Perform 21 specific tax compliance checks based on Turkish Tax Legislation (VUK, KVK, etc.). For each check, provide:
            - 'kategori': A category for the risk. Use one of the following: 'Alacak Riskleri', 'Varlık Riskleri', 'Borç ve Kaynak Riskleri', 'Kar/Zarar ve Gider Riskleri', 'Genel Uyum Riskleri'.
            - 'durum': 'Evet' for compliant/no risk, or 'Hayır' for potential risk/review needed.
            - 'aciklama': A detailed explanation of the finding. **Do not include legal article references in this field.**
            - 'mevzuatReferanslari': A list of relevant Turkish Tax Code articles (e.g., 'VUK Madde 323'). If no specific article applies, return an empty array.
            - 'uyariMesaji': **If and only if 'durum' is 'Hayır'**, provide a short, urgent warning tip (max 1-2 sentences). This tip should highlight the core risk related to the specific account codes. For example, for 'Ortaklardan Alacaklar' (Acct 131), the tip could be "131 nolu hesapta yüksek bakiye, örtülü kazanç dağıtımı riski taşır ve KDV'li faiz faturası gerektirir. Acil inceleyin." If 'durum' is 'Evet', this field must be omitted or null.

            Here are the checks to perform with their categories and legal references to extract:
            - **1. Çek ve Senetlerde Reeskont Uygulaması:** Kategori: 'Alacak Riskleri'. Check accounts 121, 122. Explain the re-discounting process and the need to use the Central Bank of Turkey's rate. Legal references: 'VUK Madde 281', 'VUK Madde 285'.
            - **2. Girişim Sermayesi Fonu İstisnası:** Kategori: 'Kar/Zarar ve Gider Riskleri'. Check accounts 645, 655. Assess for venture capital fund investment. Legal references: 'KVK Madde 10/1-g', 'VUK Madde 325/A'.
            - **3. Şüpheli Ticari Alacaklardaki Hareket:** Kategori: 'Alacak Riskleri'. Check accounts 128, 129. Analyze if provisions for doubtful accounts are correctly recorded (only after legal action). Legal reference: 'VUK Madde 323'.
            - **4. Ortaklardan Alacaklar:** Kategori: 'Alacak Riskleri'. Check account 131. If there's a significant balance, explain that an imputed interest must be calculated and invoiced with VAT (arm's length principle).
            - **5. Stok Değer Düşüklüğü ve/veya İmha:** Kategori: 'Varlık Riskleri'. Check accounts 157, 158. Explain that provision for stock value decrease is a non-deductible expense unless a valuation committee decision is obtained. Legal reference: 'VUK Madde 278'.
            - **6. Gelir Tahakkuku Analizi:** Kategori: 'Kar/Zarar ve Gider Riskleri'. Check account 181. Analyze for significant accruals, explaining that revenue must be recognized in the period it is earned.
            - **7. KDV Beyannamesi Tutarlılığı:** Kategori: 'Genel Uyum Riskleri'. Cross-check accounts 190 and 391 balances with typical VAT declaration flows.
            - **8. Geçici Vergi ve Kurumlar Vergisi Uyumu:** Kategori: 'Genel Uyum Riskleri'. Check accounts 193 and 360. Verify if prepaid taxes are correctly offset against corporate tax liability.
            - **9. Amortisman Hesaplamaları ve VUK Uyumu:** Kategori: 'Varlık Riskleri'. Check accounts 257, 7XX. Explain that depreciation must follow rates and methods in VUK. Legal references: 'VUK Madde 313', 'VUK Madde 321'.
            - **10. Yeniden Değerleme Fonları:** Kategori: 'Borç ve Kaynak Riskleri'. Check account 522. Explain tax implications of revaluation funds.
            - **11. Bağış ve Yardımların İndirimi:** Kategori: 'Kar/Zarar ve Gider Riskleri'. Check accounts 689, 770. Explain donation deductibility rules and limits. Legal reference: 'KVK Madde 10'.
            - **12. Örtülü Sermaye ve Transfer Fiyatlandırması:** Kategori: 'Borç ve Kaynak Riskleri'. Check accounts 131, 331. Explain risk of disguised capital and transfer pricing if not at arm's length. Legal references: 'KVK Madde 12', 'KVK Madde 13'.
            - **13. Yurtdışı Kazanç İstisnaları:** Kategori: 'Kar/Zarar ve Gider Riskleri'. Check accounts 601, 570. Explain conditions for tax exemptions for foreign-sourced incomes. Legal reference: 'KVK Madde 5'.
            - **14. Ar-Ge ve Tasarım İndirimleri:** Kategori: 'Kar/Zarar ve Gider Riskleri'. Check accounts 263, 549. Explain potential for deductions. Legal reference: 'Law No. 5746'.
            - **15. E-Defter ve E-Fatura Uyumluluğu:** Kategori: 'Genel Uyum Riskleri'. General compliance check on GİB e-document standards. Note it cannot be verified from tables.
            - **16. Damga Vergisi Yükümlülükleri:** Kategori: 'Genel Uyum Riskleri'. General reminder about stamp duty on legal papers.
            - **17. Personel Giderleri ve SGK Primleri Uyumu:** Kategori: 'Kar/Zarar ve Gider Riskleri'. Check accounts 7XX and 361. Explain importance of consistency between payroll and social security declarations.
            - **18. Kanunen Kabul Edilmeyen Giderler (KKEG):** Kategori: 'Kar/Zarar ve Gider Riskleri'. Check account 689. Identify potential non-deductible expenses and explain they must be added back to find fiscal profit.
            - **19. Yatırım Teşvik Belgeleri Kullanımı:** Kategori: 'Varlık Riskleri'. Check asset accounts (25X) and equity (54X). Explain benefits if an Investment Incentive Certificate is held.
            - **20. Zarar Mahsubu İşlemleri:** Kategori: 'Kar/Zarar ve Gider Riskleri'. Check accounts 570, 580. Explain that past fiscal year losses can be offset for a maximum of 5 years. Legal reference: 'KVK Madde 9'.
            - **21. Kasa ve Banka Hesapları Mutabakatı:** Kategori: 'Varlık Riskleri'. Check accounts 100 and 102. Warn that an unusually high balance in 'Kasa' account is a major tax audit risk. Legal reference: 'VUK'.

        4.  **Income/Expense Analysis Chart (gelirGiderAnalizi):** Generate the data for this chart.
        5.  **KURGAN Strategic Risk Analysis (Kurgan Analizi):**
            *   Act as a Turkish tax inspector performing a preliminary risk assessment for the use of fraudulent documents ('Sahte ve Muhteviyatı İtibarıyla Yanıltıcı Belge - SMİYB'), based on the principles of the 'KURGAN' system and the official circular (Genelge) dated 18.04.2025.
            *   Analyze the company's financial data against the **13 criteria for assessing intent ('kast değerlendirmesi')**.
            *   For each criterion:
                *   Provide a risk status ('Düşük', 'Orta', 'Yüksek', or 'Tespit Edilmedi' if data is insufficient).
                *   Write a detailed analysis ('analizDetayi') explaining your findings.
                *   List the relevant account codes ('ilgiliHesaplar') you used for the analysis.
                *   State the reference ('mevzuatReferansi') from the circular (e.g., 'Genelge Madde 1.1').
            *   Based on the 13 criteria, determine an overall risk status ('genelRiskDurumu').
            *   Provide a concise executive summary ('riskOzeti') of the findings.
            *   Provide a list of actionable recommendations ('aksiyonOnerileri') for the company to mitigate the identified risks.

            **The 13 KURGAN Criteria to Analyze:**
            1.  **VTR Bulguları (Madde 1.1):** Analyze if the provided text contains any reference to a 'Vergi Tekniği Raporu' (VTR) for suppliers. If not, state that this information is external and cannot be verified from the document.
            2.  **Faaliyet Konusu Uyumu (Madde 1.2):** Check if purchased goods/services in high-cost accounts (e.g., 153, 740, 760, 770) are consistent with the company's main line of business, which can be inferred from its name or major revenue accounts (e.g., 600).
            3.  **Tutar ve Oran Analizi (Madde 1.3):** Analyze the ratio of major expense items to total expenses and their VAT (from 191) to total deductible VAT. Flag unusually large, single-source purchases.
            4.  **İlişkili Kişi Durumu (Madde 1.4):** Check for transactions with related parties (e.g., accounts 131, 331) and assess if they seem commercially logical. State that a full analysis requires external data.
            5.  **Genel Mali Durum (Madde 1.5):** Analyze profitability, business volume (revenue), and tax compliance (e.g., consistent profits vs. losses, '193 Peşin Ödenen Vergiler' vs. '360 Ödenecek Vergi'). A company that is consistently profitable is a lower risk.
            6.  **Çoklu Kaynak Kullanımı (Madde 1.6):** Analyze the diversity of suppliers in '320 Satıcılar'. Heavy reliance on a single or few suppliers for a common good/service might increase risk. Note that detailed supplier data is limited.
            7.  **Depolama Kapasitesi (Madde 1.7):** Compare stock levels ('153 Stoklar') with fixed assets ('25x Duran Varlıklar'). A very high inventory without corresponding storage assets (buildings, warehouses) is a red flag.
            8.  **Sevkiyat Gerçekliği (Madde 1.8):** State that physical shipment documents are not in the provided text, but remind the user that for high-value purchases, delivery notes and transport documents are crucial evidence.
            9.  **Ödeme Yöntemleri (Madde 1.9):** Analyze the balance between '100 Kasa' and '102 Bankalar' and '103 Verilen Çekler'. Heavy use of cash for large transactions is a high-risk indicator. Payments via bank transfers or checks are lower risk.
            10. **Yoklama Tutanakları (Madde 1.10):** State that attendance check ('yoklama') reports are external documents and cannot be analyzed.
            11. **Mükellefin Geçmişi (Madde 1.11):** State that the company's own audit history is external and cannot be analyzed.
            12. **Ortak/Yönetici Geçmişi (Madde 1.12):** State that the history of partners/directors is external and cannot be analyzed.
            13. **Belge ve İmza Tarihi Uyumu (Madde 1.13):** State that this check applies to e-documents' metadata and cannot be verified from the financial statements.

        Return the data in a single JSON object conforming to the provided schema.

        Text to analyze:
        ---
        ${pdfText}
        ---
    `;
    const analysisData = await makeApiCallInternal("Finansal analizler ve hesaplamalar yapılıyor...", analysisPartSchema, analysisPrompt, onProgress);

    const cashFlowPrompt = `
        Based on the provided financial tables (Bilanço and Gelir Tablosu) for two consecutive periods, create a 'Nakit Akım Tablosu' (Cash Flow Statement) using the indirect method.

        Your tasks:
        1.  Start with the 'Dönem Net Karı' (Net Income).
        2.  Adjust for non-cash items (e.g., Amortismanlar).
        3.  Adjust for changes in working capital accounts (e.g., changes in Ticari Alacaklar, Stoklar, Ticari Borçlar). Calculate the 'İşletme Faaliyetlerinden Net Nakit Akışı'.
        4.  Analyze changes in long-term assets to determine 'Yatırım Faaliyetlerinden Net Nakit Akışı'.
        5.  Analyze changes in long-term liabilities and equity to determine 'Finansman Faaliyetlerinden Net Nakit Akışı'.
        6.  Calculate the net increase/decrease in cash, and verify it by comparing the 'Dönem Başı Nakit' and 'Dönem Sonu Nakit' from the balance sheet.
        
        Present the result in the specified JSON format.

        Financial Data:
        ---
        ${JSON.stringify({ bilanco: tablesData.bilanco, gelirGider: tablesData.gelirGider }, null, 2)}
        ---
    `;

    const nakitAkimData = await makeApiCallInternal("Nakit akım tablosu oluşturuluyor...", nakitAkimSchema, cashFlowPrompt, onProgress);
    
    onProgress("Analiz tamamlanıyor...");
    
    const finalData = { ...tablesData, ...analysisData, nakitAkim: nakitAkimData };

    return finalData as AnalysisData;
};

export const generateDetailedTaxReport = async (
    items: VergiselAnalizItem[],
    pdfText: string
): Promise<DetailedTaxReportItem[]> => {
    const prompt = `
        You are an expert Turkish tax auditor providing a detailed analysis for a financial consultant.
        Analyze the following items identified as potential risks (durum: 'Hayır') from a corporate tax return.
        
        For each item, structure your response with four sections in TURKISH:
        1.  **Risk Analizi:** Explain the specific tax risk in detail. Describe why the situation is a risk. **DO NOT** include the legal article references in this text; they will be listed separately.
        2.  **Mevzuat Referansları:** Provide a list of the specific, relevant articles from the Turkish Tax Code (e.g., 'VUK Madde 323', 'KVK Madde 10').
        3.  **Potansiyel Vergi Cezaları:** Based on the risk analysis, describe the potential financial consequences. This must include details on the 'vergi ziyaı cezası' (typically one-fold of the lost tax amount as per VUK 344) and 'gecikme faizi' (late payment interest calculated based on Law no. 6183). Be specific about how these penalties would apply to the identified risk.
        4.  **Yapılması Gerekenler:** Provide a clear, actionable list of steps (using bullet points) the financial advisor should take to investigate the issue, correct the records, and ensure full compliance. This should be a practical guide.
        
        Base your detailed analysis on the provided context from the full financial document text.

        Items to report on:
        ---
        ${JSON.stringify(items, null, 2)}
        ---

        Full financial document text for context:
        ---
        ${pdfText}
        ---

        Return the response in a structured JSON array according to the schema.
    `;

    const reportData = await makeApiCallInternal(
        "Detaylı vergi raporu oluşturuluyor...",
        detailedTaxReportSchema,
        prompt
    );

    return reportData;
};