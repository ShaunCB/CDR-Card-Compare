# OpenCard AU (Community Fork)

> **LEGAL DISCLAIMER & NOTICE OF INTENT**
> OpenCard AU is an independent, open-source **technical demonstration and developer preview tool** designed solely to showcase the data-sharing capabilities of Australia’s Consumer Data Right (CDR) framework. It is a community-driven fork of the [original Data Standards Body (DSB) Product Comparator demo](https://github.com/ConsumerDataStandardsAustralia/product-comparator-demo). 
> 
> This project is maintained independently and is **not** a financial service, does **not** provide financial advice, does **not** hold an Australian Financial Services Licence (AFSL), and is **not** affiliated with, endorsed by, or associated with the DSB, the ACCC, the Treasury, or the Australian Government. Use entirely at your own risk.

## Overview
OpenCard AU is a developer-focused technical showcase designed to demonstrate how public, unauthenticated **Product Reference Data (PRD)** APIs operate under the Australian Open Banking framework. 

By targeting the standardized endpoints of registered Data Holders, this application illustrates how disparate, raw JSON payloads can be aggregated, normalized, and visualized within a unified interface. 

While the DSB offers their own official live demo of the Product Comparator, the original government repository is currently experiencing API schema compatibility issues. Therefore, this independent project serves as a functional, patched alternative for developers, researchers, and technical architects exploring CDR implementations.

### Technical Enhancements in this Version
*   **Focused API Scope:** Streamlined the data parsing pipelines to focus exclusively on Credit and Charge Card PRD schemas.
*   **Expanded Endpoint Coverage:** Integrated API mappings for non-bank lender public endpoints, expanding the breadth of the technical demonstration beyond major ADIs.
*   **Schema & Version Patches:** Resolved critical bugs in the `get product` API payloads and corrected version-header mismatch errors that were causing fetch failures in the legacy reference application.
*   **Modernized Interface:** Refactored the frontend layout to improve visual hierarchy and data-grid scannability when reviewing product attributes.
*   **Zero-PII Architecture:** Operates entirely on public, unauthenticated PRD. The application does not contain code to connect to consumer data clusters, store personal details, or handle user banking credentials.

---

## Local Setup and Installation

### Prerequisites
Before you begin, ensure you have the following installed on your local machine:
*   **Git** (for cloning the repository)
*   **Node.js (v18.0.0 or higher)** (Recommended: **v20 LTS** or **v22 LTS** to ensure seamless Vite compiler compatibility)
*   **npm** (included with Node.js) or **Yarn**

### Installation
Clone this repository to your local machine by running the following command in your terminal:

```bash
git clone [https://github.com/ShaunCB/OpenCard-AU.git](https://github.com/ShaunCB/OpenCard-AU.git)
```

---

## Contributing
Contributions are welcome! If you encounter Data Holders updating their PRD schemas, or if you have improvements for data parsing and visualization, please feel free to open an issue or submit a Pull Request. 

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. Originally adapted from the Consumer Data Standards Australia demonstration tool.
