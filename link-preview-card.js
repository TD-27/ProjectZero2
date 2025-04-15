/**
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `link-preview-card`
 *
 * @demo index.html
 * @element link-preview-card
 */
export class LinkPreviewCard extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.title = "";
    this.href = "";
    this.description = "";
    this.image = "";
    this.link = "";
    this.themeColor = "";
    this.loadingState = false;
    this.layout = "vertical";

    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      href: { type: String },
      description: { type: String },
      image: { type: String },
      link: { type: String },
      themeColor: { type: String },
      loadingState: { type: Boolean, reflect: true, attribute: "loading-state" },
      layout: { type: String },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-navigation);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-3);
          max-width: 400px;
          background-color: var(--ddd-theme-accent, #2b2b2b);
          border: var(--ddd-border-sm) solid var(--themeColor, #333);
          transition: transform 0.2s;
        }

        :host(:hover) {
          transform: translateY(-5px);
        }

        .preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .horizontal {
          flex-direction: row;
          text-align: left;
        }

        .horizontal img {
          max-width: 40%;
          margin-right: var(--ddd-spacing-2);
        }

        .horizontal .title,
        .horizontal .desc {
          text-align: left;
        }

        img {
          max-width: 80%;
          height: auto;
          margin: var(--ddd-spacing-0) auto;
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-lg) solid var(--themeColor, #555);
        }

        .title {
          font-weight: bold;
          font-size: var(--ddd-font-size-s);
          margin: var(--ddd-spacing-4) 0;
          color: var(--themeColor, #fff);
        }

        details {
          border: var(--ddd-border-sm) solid var(--themeColor, #444);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2);
          max-height: 70px;
          overflow: auto;
        }

        .desc {
          font-size: var(--ddd-font-size-3xs);
          color: var(--ddd-theme-default-white, #eee);
        }

        .url {
          display: inline-block;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          font-weight: bold;
          color: var(--ddd-theme-default-white, #fff);
          border: var(--ddd-border-sm) solid var(--themeColor, #777);
          border-radius: var(--ddd-radius-sm);
          text-decoration: none;
          transition: background-color 0.3s ease-in-out;
        }

        .url:hover {
          background-color: var(--themeColor, #444);
        }

        .loading-spinner {
          width: 30px;
          height: 30px;
          border: var(--ddd-border-lg) solid var(--ddd-theme-default-white, #ccc);
          border-top-color: var(--ddd-theme-default-skyBlue, #00f);
          border-radius: 50%;
          animation: spin 2s linear infinite;
          margin: auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          :host {
            max-width: 100%;
            padding: var(--ddd-spacing-3);
          }
        }
      `,
    ];
  }

  updated(changedProps) {
    if (changedProps.has("href") && this.href) {
      this.fetchData(this.href);
    }
  }

  async fetchData(link) {
    this.loadingState = true;
    try {
      const response = await fetch(`https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      this.title = json.data["og:title"] || json.data["title"] || "No Title Available";
      this.description = json.data["description"] || "No Description Available";
      this.image = json.data["image"] || json.data["logo"] || json.data["og:image"] || "";
      this.link = json.data["url"] || link;
      this.themeColor = json.data["theme-color"] || this.defaultTheme();
    } catch (e) {
      console.warn("Preview failed:", e);
      this.title = "No Preview Available";
      this.description = "";
      this.image = "";
      this.link = "";
      this.themeColor = this.defaultTheme();
    } finally {
      this.loadingState = false;
    }
  }

  defaultTheme() {
    return this.href.includes("psu.edu") ? "var(--ddd-primary-2)" : "var(--ddd-primary-15)";
  }

  render() {
    return html`
      <div class="preview ${this.layout === "horizontal" ? "horizontal" : ""}" role="group" aria-label="Website preview card">
        ${this.loadingState
          ? html`<div class="loading-spinner" role="status" aria-live="polite"></div>`
          : html`
              ${this.image ? html`<img src="${this.image}" alt="${
