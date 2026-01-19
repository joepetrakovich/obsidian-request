---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

## Add http requests to your Obsidian notes

<div class="request-example">

<pre><code><span class="code-fence">```request</span>
<span class="code-property">url</span><span class="code-punctuation">:</span> <span class="code-url">https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY</span>
<span class="code-separator">---</span>
<span class="code-tag">&lt;img</span> <span class="code-attr">src</span><span class="code-punctuation">=</span><span class="code-string">"</span><span class="code-template">&#123;&#123;url&#125;&#125;</span><span class="code-string">"</span> <span class="code-attr">alt</span><span class="code-punctuation">=</span><span class="code-string">"</span><span class="code-template">&#123;&#123;title&#125;&#125;</span><span class="code-string">"</span> <span class="code-tag">/&gt;</span>
<span class="code-tag">&lt;details&gt;</span>
  <span class="code-tag">&lt;summary&gt;</span><span class="code-template">&#123;&#123;title&#125;&#125;</span><span class="code-tag">&lt;/summary&gt;</span>
  <span class="code-template">&#123;&#123;explanation&#125;&#125;</span>
<span class="code-tag">&lt;/details&gt;</span>
<span class="code-fence">```</span>
</code></pre>

<img class="rei" alt="CTB 1: The Medulla Nebula" src="{{ '/assets/images/ctb1.jpg' | relative_url }}">
<details>
  <summary>CTB 1: The Medulla Nebula</summary>
What powers this unusual nebula? CTB 1 is the expanding gas shell that was left when a massive star toward the constellation of Cassiopeia exploded about 10,000 years ago.
</details>

</div>
<br />
## Configuration

Add a `request` codeblock anywhere in your notes and then add the below fields as needed:

| field | type | required | description |
|-------|------|----------|-------------|
| url | URL | yes | The HTTP/HTTPS endpoint to request |
| method | string | no | HTTP method: GET, POST, PUT, or DELETE (default: GET) |
| headers | array | no | Request headers as key-value pairs |
| body | JSON | no | Request body (for POST/PUT requests) |
| path | string | no | <a href="https://github.com/JSONPath-Plus/JSONPath">JSONPath</a> expression to extract data from response |
| then | object | no | Chain another request using data from the previous response |
| --- | string | no | Separator between config and template. Use <a href="https://handlebarsjs.com/">Handlebars JS</a> templates below |

## Examples

### Random Waifu

<pre><code><span class="code-fence">```request</span>
<span class="code-property">url</span><span class="code-punctuation">:</span> <span class="code-url">https://api.waifu.im/search?included_tags=maid</span>
<span class="code-property">path</span><span class="code-punctuation">:</span> <span class="code-value">$.images[0]</span>
<span class="code-separator">---</span>
<span class="code-tag">&lt;img</span> <span class="code-attr">src</span><span class="code-punctuation">=</span><span class="code-string">'</span><span class="code-template">&#123;&#123;url&#125;&#125;</span><span class="code-string">'</span> <span class="code-tag">/&gt;</span>
<span class="code-fence">```</span></code></pre>


### Chained Authentication Request
Chain unlimited requests.  The response value can be embedded into the URL, headers, or body of the next
request using the handlebars templates.

<pre><code><span class="code-fence">```request</span>
<span class="code-property">url</span><span class="code-punctuation">:</span> <span class="code-url">http://localhost:8080/auth</span>
<span class="code-property">method</span><span class="code-punctuation">:</span> <span class="code-value">POST</span>
<span class="code-property">then</span><span class="code-punctuation">:</span>
  <span class="code-property">url</span><span class="code-punctuation">:</span> <span class="code-url">http://localhost:8080/verify</span>
  <span class="code-property">method</span><span class="code-punctuation">:</span> <span class="code-value">POST</span>
  <span class="code-property">headers</span><span class="code-punctuation">:</span>
    <span class="code-punctuation">-</span> <span class="code-property">Authorization</span><span class="code-punctuation">:</span> <span class="code-value">Bearer</span> <span class="code-template">&#123;&#123; token &#125;&#125;</span>
<span class="code-fence">```</span></code></pre>

### Random Stoicism Quote

<pre><code><span class="code-fence">```request</span>
<span class="code-property">url</span><span class="code-punctuation">:</span> <span class="code-url">https://stoic-quotes.com/api/quote</span>
<span class="code-separator">---</span>
<span class="code-tag">&lt;blockquote&gt;&lt;p&gt;</span><span class="code-template">&#123;&#123;text&#125;&#125;</span><span class="code-tag">&lt;/p&gt;</span><span class="code-punctuation">-</span><span class="code-template">&#123;&#123;author&#125;&#125;</span><span class="code-tag">&lt;/blockquote&gt;</span>
<span class="code-fence">```</span></code></pre>

### Random Bible Verse

<pre><code><span class="code-fence">```request</span>
<span class="code-property">url</span><span class="code-punctuation">:</span> <span class="code-url">https://bible-api.com/data/web/random</span>
<span class="code-property">path</span><span class="code-punctuation">:</span> <span class="code-value">$.random_verse</span>
<span class="code-separator">---</span>
<span class="code-template">&#123;&#123;book&#125;&#125;</span> <span class="code-template">&#123;&#123;chapter&#125;&#125;</span> <span class="code-template">&#123;&#123;verse&#125;&#125;</span>
<span class="code-tag">&lt;br /&gt;</span>
<span class="code-template">&#123;&#123;text&#125;&#125;</span>
<span class="code-fence">```</span></code></pre>
