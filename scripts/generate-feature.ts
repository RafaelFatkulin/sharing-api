import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

async function generateFeature(featureName: string) {
  if (!featureName) {
    console.error("Пожалуйста, укажите название фичи");
    process.exit(1);
  }

  const featurePath = join(process.cwd(), "src", "features", featureName);

  try {
    await mkdir(featurePath, { recursive: true });
    console.log(`Создана папка фичи: ${featurePath}`);

    const files = [
      `${featureName}.model.ts`,
      `${featureName}.repository.ts`,
      `${featureName}.route.ts`,
      `${featureName}.schema.ts`,
      `${featureName}.service.ts`,
      `${featureName}.types.ts`,
    ];

    for (const file of files) {
      const filePath = join(featurePath, file);
      await writeFile(filePath, "");
      console.log(`Создан файл: ${filePath}`);
    }

    console.log(`Фича "${featureName}" успешно создана!`);
  } catch (error) {
    console.error("Ошибка при создании фичи:", error);
    process.exit(1);
  }
}
const featureName = process.argv[2];
generateFeature(featureName);
