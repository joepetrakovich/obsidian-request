import { Component, MarkdownRenderChild, MarkdownRenderer, Plugin, requestUrl } from 'obsidian';
import { JSONPath } from 'jsonpath-plus';
import * as Handlebars from "handlebars";
import { parse } from 'config';

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
				const response = await requestUrl(params);
				const data = path ? JSONPath({ path, json: response.json, wrap: false }) : response.json;
				let output = JSON.stringify(data);

				if (template) {
					const ht = Handlebars.compile(template);
					output = ht(data);
				}

				el.innerHTML = output;
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
