/**
 * Copyright 2025 BetaGam3r
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
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-3);
          max-width: 400px;
          border: var(--ddd-border-sm) solid var(--themeColor);
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

        img {
          max-width: 80%;
          height: auto;
          margin: var(--ddd-spacing-0) auto;
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-lg) solid var(--themeColor);
        }

        .title {
          font-weight: bold;
          font-size: var(--ddd-font-size-s);
          margin: var(--ddd-spacing-4) 0;
          color: var(--themeColor);
        }

        details {
          border: var(--ddd-border-sm) solid var(--themeColor);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2);
          height: 70px;
          overflow: auto;
          text-align: center;
        }

        .desc {
          font-size: var(--ddd-font-size-3xs);
          color: var(--ddd-theme-default-white);
          margin: var(--ddd-spacing-2) 0;
        }

        .url {
          display: inline-block;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          font-weight: bold;
          color: var(--ddd-theme-default-white);
          border: var(--ddd-border-sm) solid var(--themeColor);
          border-radius: var(--ddd-radius-sm);
          transition: background-color 0.3s ease-in-out;
          text-decoration: none;
        }

        .url:hover {
          background-color: var(--themeColor);
        }

        .loading-spinner {
          width: 30px;
          height: 30px;
          border: var(--ddd-border-lg) solid var(--ddd-theme-default-white);
          border-top-color: var(--ddd-theme-default-skyBlue);
          border-radius: 50%;
          animation: spin 2s linear infinite;
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

  updated(changedProperties) {
    if (changedProperties.has("href") && this.href) {
      this.fetchData(this.href);
    }
  }

  async fetchData(link) {
    this.loadingState = true;
    try {
      const response = await fetch(`https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`);
      if (!response.ok) throw new Error(`Response Status: ${response.status}`);
      
      const json = await response.json();
      this.title = json.data["og:title"] || json.data["title"] || "No Title Available";
      this.description = json.data["description"] || "No Description Available";
      this.image = json.data["image"] || json.data["logo"] || json.data["og:image"] || "";
      this.link = json.data["url"] || link;
      this.themeColor = json.data["theme-color"] || this.defaultTheme();
    } catch (error) {
      console.error("Error fetching metadata:", error);
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
}

globalThis.customElements.define(LinkPreviewCard.tag, LinkPreviewCard);