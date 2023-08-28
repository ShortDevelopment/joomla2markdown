import { readFileSync } from "fs";

export const FormatDate = (str: string) => new Date(str).toISOString();

export function ReadJsonFile<T>(fileName: string): T {
    const content = readFileSync(fileName, { encoding: "utf-8" });
    return JSON.parse(content) as T;
}

export class StringBuilder {
    #content = "";
    Append(value: string): void {
        this.#content += value ?? "";
    }
    AppendLine(value?: string | null): void {
        this.Append((value ?? "") + "\n");
    }
    ToString(): string {
        return this.#content;
    }
}