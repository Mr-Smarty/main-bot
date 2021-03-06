import path from "path"
import YAML from "yaml"
import fs from "fs"
import Client from "../Client"
import { SuggestionStatus } from "../../entities/Suggestion"
import { Action } from "../../entities/ActionLog"
import { EmojiIdentifierResolvable } from "discord.js"

export type GuildCategories = { main: string; staff: string }
export type SuggestionCategories = Record<SuggestionStatus, string>
export type ActionLogCategories = Record<Action, string>
export type ReactionRole = { [key: string]: { [key: string]: { [key: string]: string } } }
export type EmojiList = { [key: string]: EmojiIdentifierResolvable }
export type ColorPalette = { success: string; error: string; info: string }
export type DatabaseInfo = { host: string; name: string; user: string; pass: string }

export default class ConfigManager implements Config {
    client: Client
    token: string
    modpack: string
    prefix: string
    logs: string
    appeal: string
    guilds: GuildCategories
    suggestions: GuildCategories & { discussion: GuildCategories }
    reactionRoles: ReactionRole
    emojis: EmojiList
    colors: ColorPalette & { suggestions: SuggestionCategories }
    assets: { suggestions: SuggestionCategories; cases: ActionLogCategories }
    database: DatabaseInfo

    constructor(client: Client) {
        this.client = client
    }

    async load(): Promise<void> {
        const configPath = path.join(__dirname, "../../../config.yml")
        const config: Config = await fs.promises
            .readFile(configPath, "utf-8")
            .then(yaml => YAML.parse(yaml))
            .catch((e: Error) => {
                this.client.logger.error(`Failed to read config.yml: ${e.message}`)
                process.exit(1)
            })
        for (const [name, resolvable] of Object.entries(config.emojis))
            if (typeof resolvable === "string" && resolvable.length === 18)
                config.emojis[name] = this.client.emojis.cache.get(resolvable as string)

        for (const [key, value] of Object.entries(config)) this[key] = value
    }

    unload(): void {
        for (const key of Object.keys(this)) {
            if (key !== "client") {
                delete this[key]
            }
        }
    }
}

export type Config = {
    token: string
    modpack: string
    prefix: string
    logs: string
    appeal: string
    guilds: GuildCategories
    suggestions: GuildCategories & { discussion: GuildCategories }
    reactionRoles: ReactionRole
    emojis: EmojiList
    colors: ColorPalette & { suggestions: SuggestionCategories }
    assets: { suggestions: SuggestionCategories; cases: ActionLogCategories }
    database: DatabaseInfo
}
