import fs from 'fs'
import readline from 'readline';
export async function parseCsvToJson(filePath: string) {
    const stream  = fs.createReadStream(filePath);
    const rl = readline.createInterface({input: stream, crlfDelay: Infinity});

    const result: any[] = []
    let headers: string[] = []

    for await (const line of rl){
        const values = line.split(",");
        if (!headers.length) {
          headers = values.map((h) => h.trim());
        } else {
          const flatObject = Object.fromEntries(
            headers.map((h, i) => [h, values[i]?.trim()])
          );
          const nested = buildNestedObject(flatObject);

          const firstName = nested.name?.firstName || "";
          const lastName = nested.name?.lastName || "";
          const fullName = `${firstName} ${lastName}`.trim();
          const age = parseInt(nested.age, 10) || 0;
          const address = nested.address || {};

          delete nested.name;
          delete nested.age;
          delete nested.address;

          result.push({
            name: fullName,
            age,
            address,
            additional_info: nested,
          });
        }
    }
    return result
}

function buildNestedObject(
  flatObject: Record<string, string>
): Record<string, any> {
  const nested: Record<string, any> = {};

  for (const key in flatObject) {
    const keys = key.split(".");
    keys.reduce((acc, part, idx) => {
      if (idx === keys.length - 1) {
        acc[part] = flatObject[key];
      } else {
        acc[part] = acc[part] || {};
      }
      return acc[part];
    }, nested);
  }

  return nested;
}