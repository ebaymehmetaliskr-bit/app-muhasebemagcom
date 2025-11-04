import { MizanItem } from '../types';

declare const XLSX: any;

// Helper to find a key in an object case-insensitively and with variations
const findKey = (obj: any, keysToFind: string[]): string | undefined => {
    if (!obj) return undefined;
    const lowerCaseKeys = Object.keys(obj).map(k => k.toLowerCase().trim());
    for (const key of keysToFind) {
        const lowerKey = key.toLowerCase().trim();
        const index = lowerCaseKeys.indexOf(lowerKey);
        if (index !== -1) {
            return Object.keys(obj)[index];
        }
    }
    return undefined;
};

export async function processExcelFile(file: File): Promise<MizanItem[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = event.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet);

                if (rawJson.length === 0) {
                    throw new Error("Excel dosyası boş veya veri bulunamadı.");
                }

                const firstRow = rawJson[0];
                const hesapKoduKey = findKey(firstRow, ['hesap numarası', 'hesap kodu', 'hesap no']);
                const hesapAdiKey = findKey(firstRow, ['hesap adı']);
                const cariDonemKey = findKey(firstRow, ['cari dönem bakiye', 'cari dönem', 'kümüle bakiye', 'bakiye']);
                const oncekiDonemKey = findKey(firstRow, ['önceki dönem bakiye', 'önceki dönem']);

                if (!hesapKoduKey || !hesapAdiKey || !cariDonemKey) {
                    throw new Error("Gerekli sütunlar (Hesap Numarası, Hesap Adı, Bakiye/Cari Dönem) Excel dosyasında bulunamadı. Lütfen dosya formatını kontrol edin.");
                }

                const mizanData: MizanItem[] = rawJson.map(row => {
                    const hesapKodu = String(row[hesapKoduKey] || '').trim();
                    const cariDonemRaw = row[cariDonemKey] || '0';
                    const oncekiDonemRaw = oncekiDonemKey ? (row[oncekiDonemKey] || '0') : '0';

                    // Handle numbers that might be strings with thousand separators or comma decimals
                    const parseCurrency = (val: any): number => {
                        if (typeof val === 'number') return val;
                        if (typeof val !== 'string') return 0;
                        const cleaned = val.replace(/\./g, '').replace(/,/g, '.');
                        const num = parseFloat(cleaned);
                        return isNaN(num) ? 0 : num;
                    };

                    const cariDonemValue = parseCurrency(cariDonemRaw);
                    const oncekiDonemValue = parseCurrency(oncekiDonemRaw);

                    // Heuristic to identify main/sub-group headers which often have non-numeric codes
                    const isRomanNumeral = (s: string) => /^[IVXLCDM]+$/.test(s.trim());
                    const isCapitalLetter = (s: string) => /^[A-Z]$/.test(s.trim());

                    const isMain = isRomanNumeral(hesapKodu);
                    const isSub = isCapitalLetter(hesapKodu);

                    return {
                        hesapKodu: hesapKodu,
                        hesapAdi: String(row[hesapAdiKey] || '').trim(),
                        cariDonem: cariDonemValue,
                        oncekiDonem: oncekiDonemValue,
                        isMain: isMain,
                        isSub: isSub,
                    };
                }).filter(item => item.hesapKodu && item.hesapAdi); // Filter out potentially empty rows

                if (mizanData.length === 0) {
                    throw new Error("Excel dosyasından geçerli mizan verisi okunamadı.");
                }

                resolve(mizanData);

            } catch (error) {
                reject(error instanceof Error ? error : new Error("Excel dosyası işlenirken bir hata oluştu. Lütfen formatı kontrol edin."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsBinaryString(file);
    });
}
