import { Component, MarkdownRenderChild, MarkdownRenderer, Plugin, requestUrl, RequestUrlResponse, sanitizeHTMLToDom } from 'obsidian';
import { JSONPath } from 'jsonpath-plus';
import * as Handlebars from "handlebars";
import { parse } from 'config';
import { JsonValue } from 'types';

export default class RequestPlugin extends Plugin {

	async onload() {
		this.registerMarkdownCodeBlockProcessor('request', async (source, el, ctx) => {
			const mdRenderComp = new MarkdownRenderChild(el);
			ctx.addChild(mdRenderComp);

			const parsed = parse(source);
			if (!parsed.success) {
				await this.appendFailureCallout(el, parsed.message, mdRenderComp);
				return Promise.resolve();
			}

			try {
				const { config: { path, ...params }, template } = parsed.data;
				const response: RequestUrlResponse = await requestUrl(params);
				const json = response.json as JsonValue;
				const data: unknown = path ? JSONPath({ path, json, wrap: false }) : json;
				let output = JSON.stringify(data);

				if (template) {
					const ht = Handlebars.compile(template);
					output = ht(data);
				}
					
				el.append(sanitizeHTMLToDom(output));
			}
			catch (error) {
				console.error(error);
				let message = error instanceof Error ? error.message : String(error);
				await this.appendFailureCallout(el, message, mdRenderComp);
			}
		});
	}

	onunload() {
	}

	async appendFailureCallout(el: HTMLElement, text: string, component: Component): Promise<void> {
		await MarkdownRenderer.render(this.app, `> [!failure] \n> ${text}`, el, "", component);
	}
	
}
