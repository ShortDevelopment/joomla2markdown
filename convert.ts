import * as fs from "fs";
import * as TurndownService from "turndown";
import { StringBuilder, FormatDate, ReadJsonFile } from "./Utils";

const service = new TurndownService({
    hr: "---",
    bulletListMarker: "-"
});

const users = new Map<string, string>();
for (const user of ReadJsonFile<JUser[]>("users.json")) {
    users.set(user.id, user.name);
}

const categories = new Map<string, JCategory>();
for (const category of ReadJsonFile<JCategory[]>("categories.json")) {
    categories.set(category.id, category);
}

let paths: string[] = [];
for (const article of ReadJsonFile<JContent[]>("content.json")) {
    paths = [];

    var catid = article.catid;
    while (catid != "0") {
        var category = categories.get(catid)!;
        paths = [category.title, ...paths];
        catid = category.parent_id;
    }

    fs.mkdirSync(paths.join('/'), { recursive: true });

    paths.push(`${article.alias}.md`);

    fs.writeFileSync(paths.join('/'), GetContent(article));
}

function GetContent(content: JContent): string {
    const stringBuilder = new StringBuilder();
    stringBuilder.AppendLine("---");
    stringBuilder.Append("title: ");
    stringBuilder.AppendLine(content.title);
    stringBuilder.Append("author: ");
    stringBuilder.AppendLine(users.get(content.created_by));
    stringBuilder.Append("created: ");
    stringBuilder.AppendLine(FormatDate(content.created));
    stringBuilder.Append("modified: ");
    stringBuilder.AppendLine(FormatDate(content.modified));
    stringBuilder.AppendLine("---");
    stringBuilder.AppendLine();

    stringBuilder.AppendLine(service.turndown(content.introtext));

    return stringBuilder.ToString();
}

interface JContent {
    title: string;
    alias: string;
    introtext: string;
    created: string;
    created_by: string;
    modified: string;
    catid: string;
}

interface JUser {
    id: string;
    name: string;
}

interface JCategory {
    id: string;
    title: string;
    parent_id: string;
}