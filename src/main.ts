import { Component, MarkdownRenderChild, MarkdownRenderer, Plugin, requestUrl, RequestUrlResponse, sanitizeHTMLToDom } from 'obsidian';
import { JSONPath } from 'jsonpath-plus';
import * as Handlebars from "handlebars";
import { type Config, parse } from 'config';
import { JsonValue } from 'types';

export default class RequestPlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor('request', async (source, el, ctx) => {
			const mdRenderChild = new MarkdownRenderChild(el);
			ctx.addChild(mdRenderChild);

			const input = parse(source);
			if (!input.success) {
				await this.appendFailureCallout(el, input.message, mdRenderChild);
				return Promise.resolve();
			}

			try {
				const { template } = input.data;
				let next: Config | undefined = input.data.config;
				let value: unknown;
				while (next) {
					const { path, then, ...params }: Config = next;
					const response: RequestUrlResponse = await requestUrl(params);
					const json = response.json as JsonValue;
					value = path ? JSONPath({ path, json, wrap: false }) : json;
					if (value && then) {
						let { url, headers, body } = then;
						then.url = replaceTemplates(url, value );
						then.headers = headers
							? Object.fromEntries(
								Object.entries(headers).map(([key, val]) => [key, replaceTemplates(val, value)])
							)
							: undefined;
						then.body = body ? replaceTemplates(body, value) : undefined;
					}
					next = then;
				}

				let output = JSON.stringify(value);
				if (template) {
					const ht = Handlebars.compile(template);
					output = ht(value);
				}

				el.append(sanitizeHTMLToDom(output));
			}
			catch (error) {
				console.error(error);
				let message = error instanceof Error ? error.message : String(error);
				await this.appendFailureCallout(el, message, mdRenderChild);
			}
		});
	}

	onunload() {
	}

	async appendFailureCallout(el: HTMLElement, text: string, component: Component): Promise<void> {
		await MarkdownRenderer.render(this.app, `> [!failure] \n> ${text}`, el, "", component);
	}
}

const handlebarsTemplateRegEx: RegExp = /\{\{\s*(.*?)\s*\}\}/g;
const replaceTemplates = (source: string, value: unknown) => {
	const regEx = handlebarsTemplateRegEx;

	if (source.match(regEx)) {
		const ht = Handlebars.compile(source);
		return ht(value);
	}
	return source;
}
