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

<img class="rei" alt="CTB 1: The Medulla Nebula" src="/assets/images/ctb1.jpg">
<details>
  <summary>CTB 1: The Medulla Nebula</summary>
What powers this unusual nebula? CTB 1 is the expanding gas shell that was left when a massive star toward the constellation of Cassiopeia exploded about 10,000 years ago.
</details>
