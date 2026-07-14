# CDR Card Compare (Community Fork)

> **Disclaimer:** This is an independent, community-driven fork of the original [Consumer Data Standards Australia (CDSA) Product Comparator Demo](https://github.com/ConsumerDataStandardsAustralia/product-comparator-demo). This project is maintained by ShaunCB and is **not** affiliated with, endorsed by, or associated with the CDSA, the ACCC, or the Australian Government. 

## Overview
This tool allows users to compare Australian credit and charge cards by accessing Open Banking (Consumer Data Right) data directly from unauthenticated APIs of registered Data Holders.

As the original government demonstration tool is currently experiencing API issues, this fork was created to provide a reliable, improved, and tightly focused alternative. 

### What's New in this Version
*   **Focused Scope:** Restricted the comparison specifically to Credit and Charge Cards.
*   **Expanded Market View:** Added support for non-bank lenders, providing a much more comprehensive view of available products.
*   **Core Bug Fixes:** Resolved the `get product` API bugs and corrected the API version pulling errors that were breaking data fetches in the original tool.
*   **Modernised Interface:** Implemented significant UI and UX improvements for a cleaner, more intuitive user experience.

---

## Local Setup and Installation

### Prerequisites
Before you begin, ensure you have the following installed:
*   **Git** (for cloning the repository)
*   **Node.js (v18.0.0 or higher)** (Recommended: **v20 LTS** or **v22 LTS** to ensure Vite compatibility)
*   **npm** (included with Node.js) or **Yarn**

### Installation
Clone this repository to your local machine by running the following command in your terminal:

```bash
git clone [https://github.com/ShaunCB/product-comparator-demo-v2.git](https://github.com/ShaunCB/product-comparator-demo-v2.git)
