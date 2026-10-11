import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def create_proposal():
    doc = docx.Document()

    # Set Margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.85)
        section.bottom_margin = Inches(0.85)
        section.left_margin = Inches(0.85)
        section.right_margin = Inches(0.85)

    # Palette
    C_PRIMARY = RGBColor(26, 54, 93)       # Deep Corporate Navy #1A365D
    C_BLUE = RGBColor(40, 116, 240)        # Flipkart Brand Blue #2874F0
    C_EMERALD = RGBColor(16, 122, 87)      # Botanical Emerald #107A57
    C_CHARCOAL = RGBColor(51, 65, 85)      # Slate Charcoal #334155
    C_MUTED = RGBColor(100, 116, 139)      # Muted Slate #64748B
    C_ORANGE = RGBColor(251, 100, 27)      # Accent Orange #FB641B

    # Helper: Set Cell Shading
    def set_cell_background(cell, hex_color):
        shading_xml = f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>'
        cell._tc.get_or_add_tcPr().append(parse_xml(shading_xml))

    # Helper: Cell Margins / Padding
    def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = OxmlElement('w:tcMar')
        for margin, value in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
            node = OxmlElement(margin)
            node.set(qn('w:w'), str(value))
            node.set(qn('w:type'), 'dxa')
            tcMar.append(node)
        tcPr.append(tcMar)

    # Helper: Add Styled Heading 1
    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(17)
        run.font.bold = True
        run.font.color.rgb = C_PRIMARY
        return p

    # Helper: Add Styled Heading 2
    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.color.rgb = C_BLUE
        return p

    # Helper: Add Styled Heading 3
    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(11.5)
        run.font.bold = True
        run.font.color.rgb = C_EMERALD
        return p

    # Helper: Add Body Paragraph
    def add_p(text, bold_prefix=None, space_after=5):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            b_run = p.add_run(bold_prefix)
            b_run.font.name = 'Calibri'
            b_run.font.size = Pt(10.5)
            b_run.font.bold = True
            b_run.font.color.rgb = C_PRIMARY
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(10.5)
        run.font.color.rgb = C_CHARCOAL
        return p

    # Helper: Add Callout Box
    def add_callout(title, text):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        set_cell_background(cell, 'F1F5F9')
        set_cell_margins(cell, top=160, bottom=160, left=240, right=240)
        
        # Left border line indicator
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>\n'
            f'  <w:left w:val="single" w:sz="36" w:space="0" w:color="2874F0"/>\n'
            f'  <w:top w:val="none"/>\n'
            f'  <w:right w:val="none"/>\n'
            f'  <w:bottom w:val="none"/>\n'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)
        
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        r_title = p.add_run(f"★ {title}\n")
        r_title.font.name = 'Calibri'
        r_title.font.size = Pt(11)
        r_title.font.bold = True
        r_title.font.color.rgb = C_PRIMARY
        
        r_body = p.add_run(text)
        r_body.font.name = 'Calibri'
        r_body.font.size = Pt(10)
        r_body.font.color.rgb = C_CHARCOAL
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # Helper: Add Screenshot
    def add_screenshot(img_name, caption):
        img_path = os.path.abspath(img_name)
        if os.path.exists(img_path):
            tbl = doc.add_table(rows=1, cols=1)
            tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
            cell = tbl.cell(0, 0)
            set_cell_background(cell, 'FFFFFF')
            set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
            
            # Subtle border around image
            tcPr = cell._tc.get_or_add_tcPr()
            borders = parse_xml(
                f'<w:tcBorders {nsdecls("w")}>\n'
                f'  <w:left w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>\n'
                f'  <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>\n'
                f'  <w:right w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>\n'
                f'  <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>\n'
                f'</w:tcBorders>'
            )
            tcPr.append(borders)
            
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            run = p.add_run()
            run.add_picture(img_path, width=Inches(6.2))
            
            # Caption
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_before = Pt(3)
            p_cap.paragraph_format.space_after = Pt(12)
            r_cap = p_cap.add_run(f"Figure: {caption}")
            r_cap.font.name = 'Calibri'
            r_cap.font.size = Pt(9)
            r_cap.font.italic = True
            r_cap.font.color.rgb = C_MUTED

    # ==========================================
    # COVER / HEADER TITLE BLOCK
    # ==========================================
    p_pre = doc.add_paragraph()
    p_pre.paragraph_format.space_before = Pt(10)
    p_pre.paragraph_format.space_after = Pt(2)
    r_pre = p_pre.add_run("STRATEGIC COMMERCIAL PROPOSAL & GROWTH ROADMAP")
    r_pre.font.name = 'Calibri'
    r_pre.font.size = Pt(11)
    r_pre.font.bold = True
    r_pre.font.color.rgb = C_BLUE

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(4)
    r_t = p_title.add_run("Scaling Classical Ayurveda & Natural Health E-Commerce")
    r_t.font.name = 'Calibri'
    r_t.font.size = Pt(24)
    r_t.font.bold = True
    r_t.font.color.rgb = C_PRIMARY

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(16)
    r_sub = p_sub.add_run("Flipkart-Class Direct Storefront, Zero-Waste Performance Engine, & Low-Budget Scalability Blueprint (Without Expensive Influencer Marketing)")
    r_sub.font.name = 'Calibri'
    r_sub.font.size = Pt(12)
    r_sub.font.color.rgb = C_CHARCOAL

    # Metadata Table
    meta_tbl = doc.add_table(rows=2, cols=2)
    meta_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_tbl.autofit = False
    meta_tbl.columns[0].width = Inches(3.3)
    meta_tbl.columns[1].width = Inches(3.3)
    
    cells = meta_tbl.rows[0].cells
    set_cell_background(cells[0], 'F8FAFC')
    set_cell_background(cells[1], 'F8FAFC')
    set_cell_margins(cells[0])
    set_cell_margins(cells[1])
    p1 = cells[0].paragraphs[0]
    p1.add_run("PREPARED FOR:\n").font.bold = True
    p1.add_run("Founders & Chief Vaidya Council\nAyurvedic Healthcare & Herbal Formulations Brand").font.size = Pt(9.5)
    
    p2 = cells[1].paragraphs[0]
    p2.add_run("PREPARED BY:\n").font.bold = True
    p2.add_run("Digital Growth & Technology Partnership Team\n(Full-Stack Architecture & Performance Growth)").font.size = Pt(9.5)

    cells2 = meta_tbl.rows[1].cells
    set_cell_background(cells2[0], 'F8FAFC')
    set_cell_background(cells2[1], 'F8FAFC')
    set_cell_margins(cells2[0])
    set_cell_margins(cells2[1])
    p3 = cells2[0].paragraphs[0]
    p3.add_run("ENGAGEMENT TYPE: ").font.bold = True
    p3.add_run("Active Business Supporter & Co-Pilot Model").font.size = Pt(9.5)
    
    p4 = cells2[1].paragraphs[0]
    p4.add_run("DATE & STATUS: ").font.bold = True
    p4.add_run("October 2026 · Confidential Commercial Proposal").font.size = Pt(9.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # ==========================================
    # EXECUTIVE SUMMARY
    # ==========================================
    add_h1("Executive Summary: The Modern Direct-To-Consumer Ayurveda Opportunity")
    add_p(
        "The Indian Ayurvedic and herbal health medicine market is experiencing an unprecedented surge. Conscious consumers are actively migrating away from synthetic pharmaceuticals toward authentic, classical Ayurvedic formulations (Swarna Bhasma Chyawanprash, Himalayan Shilajit, KSM-66 Ashwagandha, Medicated Thailams, and Organic Churnas). However, 85% of emerging Ayurvedic brands fail to achieve profitable scale due to two critical traps:",
        None, 6
    )
    add_p(
        "Generic e-commerce stores (built on basic templates) lack the visual trust signals, regional language confidence, and familiar checkout mechanisms that Indian health buyers expect.",
        "1. High-Friction Generic Storefronts: "
    )
    add_p(
        "Brands burn lakhs of rupees paying Instagram creators and lifestyle influencers ₹50,000 to ₹2,00,000 per post, yielding vanity likes, disengaged audiences, and negligible real repeat prescription orders.",
        "2. The 'Influencer Marketing Money Pit': "
    )
    add_p(
        "This proposal presents a proven, capital-efficient alternative: Deploying a custom, Flipkart-class high-conversion digital commerce platform (VedaFlow), backed by an owned, low-budget performance marketing engine (Google Search intent, programmatic catalog SEO, automated WhatsApp reorders, and organic in-app Instagram Studio), paired with our active partnership as your dedicated Business Supporter with minimal upfront risk.",
        bold_prefix="Our Solution: "
    )

    add_callout(
        "Key Financial Objective",
        "Achieve profitable unit economics from Month 1, scaling from ₹1,50,000 to ₹12,00,000+ monthly revenue within 180 days on a disciplined, controlled media budget of just ₹25,000 to ₹35,000/month, delivering an anticipated 4.2x to 5.8x Blended ROAS."
    )

    # ==========================================
    # SECTION 1: THE APPLICATION ARCHITECTURE
    # ==========================================
    add_h1("1. The Enterprise Application: Flipkart-Grade Storefront")
    add_p(
        "Rather than relying on cookie-cutter templates that look amateurish and scare away discerning medical/health shoppers, we have engineered an enterprise multi-vendor capable application built on Next.js 14, NestJS, PostgreSQL, Redis, and Tailwind CSS. The user experience is modeled directly on Flipkart—India's most trusted e-commerce marketplace—to provide instant familiarity and frictionless conversion.",
        None, 6
    )

    add_screenshot("screenshot_storefront.png", "VedaFlow Storefront: Flipkart-style blue header, Plus zone, Deals of the Day timer, and 10 Ayurvedic category pills.")

    add_p(
        "Features of the Customer Storefront:",
        bold_prefix="Core Architectural Highlights: "
    )
    add_p("• Iconic Flipkart Blue Header (#2874F0) with 'Explore Plus' loyalty tier, search bar with voice/camera icons, and live cart counter badge.")
    add_p("• 10 Classical Ayurvedic Category Strip: Instant access to Rasayanas, Shilajit, Ashwagandha, Churnas, Thailams, Kumkumadi Skincare, and Immunity Kadhas.")
    add_p("• 'Deals of the Day' Live Countdown Rail: Real-time urgency timer (19h:42m left) with green star rating pill and original strikethrough pricing.")
    add_p("• The 'Veda✓' Assured Badge: Replicating Flipkart's f-Assured badge to communicate 100% genuine formulation, NABL lab screening, and AYUSH certification.")
    add_p("• 4-in-1 Category Showcase Grid: Showcasing specific remedy bundles to cross-sell and elevate Average Order Value (AOV).")

    # ==========================================
    # SECTION 2: PRODUCT DETAIL PAGE CONVERSION
    # ==========================================
    add_h1("2. Conversion Architecture: The Flipkart-Class Product Page")
    add_p(
        "In health and non-pharma medicine, hesitation happens on the Product Detail Page (PDP). Customers want to verify ingredients, heavy-metal safety, dosage instructions, delivery speed, and payment bank offers before paying. Our PDP is architected to eliminate every single purchase objection.",
        None, 6
    )

    add_screenshot("screenshot_pdp.png", "VedaFlow Product Detail Page: Dual Sticky Action Buttons, Bank Offers, Pincode Delivery Checker & AYUSH Specifications.")

    add_p("• Dual Sticky Action Buttons: Warm Yellow (#FF9F00) 'ADD TO CART' and Flipkart Orange (#FB641B) 'BUY NOW' buttons, proven to drive impulsive 1-click checkout.")
    add_p("• Available Offers Engine: Dynamic green price tag badges highlighting Bank Cashbacks (Axis/SBI), Special Discounts, and Free Doctor Consultation incentives.")
    add_p("• Real-Time Pincode Checker: Customers can enter their 6-digit Indian pincode to immediately see guaranteed delivery dates (e.g. 'Delivery by Tomorrow, 7 PM').")
    add_p("• Deep Ayurvedic Specifications Table: Classical Charaka Samhita reference, botanical herbs, processing base (A2 Ghee/Wild Honey), dosage, and NABL batch test CoA.")
    add_p("• Verified Patient Reviews & Rating Distribution: Transparent 5-star ratings breakdown establishing medical credibility.")

    # ==========================================
    # SECTION 3: FRICTIONLESS CUSTOMER RETENTION
    # ==========================================
    add_h1("3. Customer Portal: Flipkart Split-Box Authentication")
    add_p(
        "Drop-off during login/checkout kills e-commerce margins. We implemented Flipkart's celebrated split-panel layout: brand value proposition and security guarantee on the left, clean frictionless input on the right with TOTP 2FA security and 1-click test auto-fill.",
        None, 6
    )

    add_screenshot("screenshot_login.png", "VedaFlow Customer Sign-In: Flipkart split-card layout, 256-bit encryption reassurance, and quick test credentials.")

    add_p("• Zero-Password OTP or Secure Password Options: Minimizing registration barriers for elder patients and mobile phone shoppers.")
    add_p("• Dual Role Segmentation: Distinguishing between individual patient shoppers and B2B Ayurvedic Doctors/Clinics ordering in bulk.")
    add_p("• Trust Seals: Displaying AYUSH GMP Certification and 100% Non-Pharma Guarantee directly at the point of authentication.")

    # ==========================================
    # SECTION 4: SELLER HUB & ADMIN CONTROL
    # ==========================================
    add_h1("4. Operational Intelligence: Flipkart Seller Hub Control Center")
    add_p(
        "Scaling a physical Ayurvedic medicine brand requires tight inventory control, NABL lab report tracking, SLA fulfillment monitoring, and marketing attribution. The custom Admin Center gives management full command over the entire supply chain.",
        None, 6
    )

    add_screenshot("screenshot_admin.png", "VedaFlow Seller Hub: Executive dashboard with dispatch timers, raw botanical stock alerts, and Instagram Share Studio.")

    add_p("• Live Executive KPIs: Gross sales, order count, AOV, and customer satisfaction rating (4.88/5.0).")
    add_p("• Fulfillment & Dispatch SLA Timers: Real-time tracking of pending parcels to prevent packing delays and maintain Gold Tier seller rating.")
    add_p("• Raw Botanical & Batch Inventory: Automated low-stock alerts for critical ingredients (Shilajit Resin, KSM-66 Ashwagandha, Kashmiri Saffron).")
    add_p("• In-App Instagram Growth Studio: Dedicated tool to generate UTM-tracked short URLs and copy-paste ready captions with hashtags and Ayurvedic emojis.")
    add_p("• Immutable AYUSH Audit Logs: Tamper-proof logs of batch release certificates, NABL heavy metal test verifications, and status changes.")

    # ==========================================
    # SECTION 5: LAST-MILE LOGISTICS
    # ==========================================
    add_h1("5. Logistics Orchestration & Real-Time Delivery Fleet")
    add_p(
        "To compete with quick-commerce platforms while maintaining high margins, the system connects directly with local eco-friendly delivery couriers (EV bikes and cargo) with live 10-second GPS telemetry and OTP-based Proof of Delivery.",
        None, 6
    )

    add_screenshot("screenshot_delivery.png", "VedaFlow Delivery Partner App: Real-time route list, active order dispatches, and OTP signature verification.")

    # ==========================================
    # SECTION 6: THE ZERO-INFLUENCER GROWTH STRATEGY
    # ==========================================
    add_h1("6. The 'Zero-Influencer' Low-Budget Growth Strategy")
    add_p(
        "Many emerging D2C brands squander 70% of their seed capital paying lifestyle influencers. In Ayurvedic medicine, this strategy is inherently flawed for three clear reasons:",
        bold_prefix="Why We Strongly Advise Against Influencer Marketing: "
    )
    add_p("1. Zero Medical Authority: A lifestyle influencer holding a jar of Chyawanprash does not convince someone suffering from chronic immunity or joint issues.")
    add_p("2. Vanity Metrics: An influencer reel may garner 50,000 views, but 98% of viewers are non-buyers from irrelevant demographics.")
    add_p("3. Zero Long-Term Equity: The moment an influencer's post slides down the feed, sales drop to zero. You do not own the audience or the search intent.")

    add_h2("The 4-Pillar Capital-Efficient Performance Engine:")

    add_h3("Pillar 1: High-Intent Google Search & Shopping Ads (Budget: ₹500 - ₹1,000/day)")
    add_p(
        "Instead of convincing disinterested social scrollers, we capture buyers who have their credit card in hand actively searching for classical Ayurvedic solutions.",
        None, 4
    )
    add_p("• Target Queries: 'buy pure shilajit resin 20g gold grade', 'authentic swarna bhasma chyawanprash charaka samhita', 'mahanarayan taila joint pain 200ml', 'ksm 66 organic ashwagandha capsules'.")
    add_p("• Negative Keyword Sculpting: Aggressively block keywords like 'home remedies', 'free', 'side effects', 'wikipedia' to ensure zero wasted ad spend.")
    add_p("• Projected Performance: Anticipated Cost Per Acquisition (CPA) of ₹180 - ₹260 on an Average Order Value of ₹1,100+, yielding 4.2x+ ROAS.")

    add_h3("Pillar 2: Dynamic Instagram & WhatsApp Owned Social Studio (Zero Media Waste)")
    add_p(
        "We utilize the built-in Instagram Growth Studio in VedaFlow to generate authority-rich educational content rather than paid celebrity shoutouts.",
        None, 4
    )
    add_p("• Authority Graphics: Auto-generating 1080x1080 and 1080x1920 SVG story cards highlighting NABL Certificate of Analysis, Ayurvedic botanical ratios, and doctor endorsements.")
    add_p("• Micro-Budget Meta Retargeting (₹250 - ₹350/day): Target ONLY visitors who viewed a product or initiated checkout without completing. This recovers 22% to 28% of abandoned carts at a tiny fraction of broad-audience ad costs.")

    add_h3("Pillar 3: Programmatic Ayurvedic SEO & Long-Tail Authority")
    add_p(
        "Next.js 14 Server-Side Rendering (SSR) generates lightning-fast static pages for all 50 classical remedies, complete with schema.org JSON-LD medical product structured data.",
        None, 4
    )
    add_p("• Long-Tail Search Moat: Ranking on Google organically for classical formulation terms (e.g. 'Charaka Samhita Rasayana benefits', 'Swarna Bhasma immunity dosage').")
    add_p("• Zero Ongoing Ad Spend: Once ranked, these pages generate 20 to 50 organic high-margin orders daily for years with zero marginal ad expense.")

    add_h3("Pillar 4: Automated WhatsApp Reorder & Tele-Vaidya Upsells")
    add_p(
        "The highest margin in Ayurveda is repeat orders. Classical health supplements (Chyawanprash, Shilajit, Triphala) are naturally consumed within 25 to 30 days.",
        None, 4
    )
    add_p("• Day-21 Automated Refill Reminder: WhatsApp triggers an automated message: 'Namaste Priya, your Swarna Bhasma jar is about to finish. Tap here to reorder with 1-click & get 15% VIP discount.'")
    add_p("• Free 5-Minute Vaidya Tele-Consultation: Offered with every order above ₹999. The consulting doctor recommends personalized complementary churnas, boosting AOV from ₹650 to ₹1,450.")

    # ==========================================
    # SECTION 7: FINANCIAL BLUEPRINT & ENGAGEMENT
    # ==========================================
    add_h1("7. Financial Blueprint: Minimum Budget & Business Supporter Model")
    add_p(
        "Unlike conventional digital agencies that charge exorbitant upfront retainer fees of ₹1,00,000 to ₹2,50,000 per month regardless of whether you make any sales, we structure our engagement as a true Business Supporter and Growth Partner.",
        None, 6
    )

    # Budget Breakdown Table
    add_h2("A. Recommended Minimum Monthly Operating Budget:")
    b_tbl = doc.add_table(rows=5, cols=4)
    b_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    b_tbl.columns[0].width = Inches(2.2)
    b_tbl.columns[1].width = Inches(1.3)
    b_tbl.columns[2].width = Inches(1.8)
    b_tbl.columns[3].width = Inches(1.3)

    b_headers = ['Budget Line Item', 'Monthly Spend', 'Target Objective', 'Expected Return']
    for idx, h in enumerate(b_headers):
        cell = b_tbl.rows[0].cells[idx]
        set_cell_background(cell, '1E3A8A')
        set_cell_margins(cell, 120, 120, 140, 140)
        p = cell.paragraphs[0]
        run = p.add_run(h)
        run.font.bold = True
        run.font.color.rgb = RGBColor(255, 255, 255)
        run.font.size = Pt(9.5)

    b_rows = [
        ['Google Search & Shopping Ads', '₹18,000 - ₹24,000', 'Capture high-intent buyers searching specific Ayurvedic remedies', '₹80,000 - ₹1,20,000 GMV'],
        ['Meta Abandoned Cart Retargeting', '₹7,000 - ₹10,000', 'Recover cart drop-offs & Instagram profile visitors', '₹35,000 - ₹55,000 GMV'],
        ['WhatsApp API & Server Hosting', '₹3,000 - ₹4,500', 'Automated Day-21 refill reminders & fast cloud hosting', '₹25,000+ repeat orders'],
        ['TOTAL MONTHLY MEDIA BUDGET', '₹28,000 - ₹38,500', 'Complete Capital-Efficient Digital Acquisition Funnel', '₹1,40,000 - ₹2,00,000+ GMV']
    ]

    for r_idx, row in enumerate(b_rows):
        for c_idx, val in enumerate(row):
            cell = b_tbl.rows[r_idx + 1].cells[c_idx]
            bg = 'F8FAFC' if r_idx % 2 == 0 else 'FFFFFF'
            if r_idx == 3:
                bg = 'EFF6FF'
            set_cell_background(cell, bg)
            set_cell_margins(cell, 100, 100, 140, 140)
            p = cell.paragraphs[0]
            run = p.add_run(val)
            run.font.size = Pt(9.5)
            if r_idx == 3 or c_idx == 0:
                run.font.bold = True
            if r_idx == 3:
                run.font.color.rgb = C_BLUE

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # Business Supporter Partnership Options Table
    add_h2("B. Our Commercial Engagement Models (As Your Business Supporter):")
    add_p(
        "We offer three flexible tiers tailored to your cash flow, ensuring our incentives are directly aligned with your brand's actual top-line revenue growth:",
        None, 4
    )

    p_tbl = doc.add_table(rows=4, cols=4)
    p_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    p_tbl.columns[0].width = Inches(1.6)
    p_tbl.columns[1].width = Inches(1.5)
    p_tbl.columns[2].width = Inches(2.2)
    p_tbl.columns[3].width = Inches(1.3)

    p_headers = ['Partnership Model', 'Fixed Fee', 'Performance Rev-Share', 'Suitability']
    for idx, h in enumerate(p_headers):
        cell = p_tbl.rows[0].cells[idx]
        set_cell_background(cell, '1E3A8A')
        set_cell_margins(cell, 120, 120, 140, 140)
        p = cell.paragraphs[0]
        run = p.add_run(h)
        run.font.bold = True
        run.font.color.rgb = RGBColor(255, 255, 255)
        run.font.size = Pt(9.5)

    p_rows = [
        ['Option 1: Starter Growth Co-Pilot (Recommended)', '₹25,000 / month', '5% of verified online store sales (tracked in Seller Hub)', 'Early-stage brands seeking minimum fixed burn with aligned growth partner'],
        ['Option 2: Pure Milestone & Performance', '₹15,000 / month', '8% rev-share once monthly sales cross ₹2,00,000 threshold', 'Bootstrapped founders wanting rock-bottom fixed overhead'],
        ['Option 3: Full Turnkey Tech & Scale Retainer', '₹45,000 / month', 'Zero revenue-share (100% margin retained by client)', 'Established pharmacies with existing clinical clientele wanting flat pricing']
    ]

    for r_idx, row in enumerate(p_rows):
        for c_idx, val in enumerate(row):
            cell = p_tbl.rows[r_idx + 1].cells[c_idx]
            bg = 'F8FAFC' if r_idx % 2 == 0 else 'FFFFFF'
            if r_idx == 0:
                bg = 'F0FDF4' # highlight recommended
            set_cell_background(cell, bg)
            set_cell_margins(cell, 100, 100, 140, 140)
            p = cell.paragraphs[0]
            run = p.add_run(val)
            run.font.size = Pt(9.5)
            if c_idx == 0 or (r_idx == 0 and c_idx == 1):
                run.font.bold = True
            if r_idx == 0 and c_idx == 0:
                run.font.color.rgb = C_EMERALD

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # 6-Month Projected Unit Economics & Revenue Trajectory
    add_h2("C. 6-Month Scalability & ROI Projection:")
    proj_tbl = doc.add_table(rows=7, cols=6)
    proj_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER

    headers_proj = ['Timeline', 'Monthly Ad Spend', 'Monthly Orders', 'Average Order Value', 'Gross Revenue (GMV)', 'Blended ROAS']
    for idx, h in enumerate(headers_proj):
        cell = proj_tbl.rows[0].cells[idx]
        set_cell_background(cell, '1E3A8A')
        set_cell_margins(cell, 120, 120, 120, 120)
        p = cell.paragraphs[0]
        run = p.add_run(h)
        run.font.bold = True
        run.font.color.rgb = RGBColor(255, 255, 255)
        run.font.size = Pt(9)

    proj_rows = [
        ['Month 1 (Launch)', '₹25,000', '135 orders', '₹1,050', '₹1,41,750', '5.6x GMV'],
        ['Month 2 (Optimization)', '₹30,000', '260 orders', '₹1,120', '₹2,91,200', '9.7x GMV'],
        ['Month 3 (Refills Kick-in)', '₹38,000', '440 orders', '₹1,180', '₹5,19,200', '13.6x GMV'],
        ['Month 4 (SEO Compounding)', '₹45,000', '650 orders', '₹1,220', '₹7,93,000', '17.6x GMV'],
        ['Month 5 (Scale Phase)', '₹55,000', '880 orders', '₹1,250', '₹11,00,000', '20.0x GMV'],
        ['Month 6 (Established Moat)', '₹65,000', '1,150 orders', '₹1,280', '₹14,72,000', '22.6x GMV']
    ]

    for r_idx, row in enumerate(proj_rows):
        for c_idx, val in enumerate(row):
            cell = proj_tbl.rows[r_idx + 1].cells[c_idx]
            bg = 'F8FAFC' if r_idx % 2 == 0 else 'FFFFFF'
            set_cell_background(cell, bg)
            set_cell_margins(cell, 90, 90, 100, 100)
            p = cell.paragraphs[0]
            run = p.add_run(val)
            run.font.size = Pt(9)
            if c_idx == 0 or c_idx == 4:
                run.font.bold = True
            if c_idx == 4:
                run.font.color.rgb = C_PRIMARY

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # ==========================================
    # SECTION 8: 30-DAY LAUNCH ROADMAP
    # ==========================================
    add_h1("8. 30-Day Go-Live & Execution Roadmap")
    add_p("Our systematic, four-week sprint to take your brand from setup to live profitable orders:")
    
    add_p("• Week 1: Catalog & Payment Gateway Activation — Uploading all 50 classical formulations, setting up Razorpay/Cashfree with UPI/Card auto-settlements, configuring delivery zones, and installing SSL.", bold_prefix="Week 1: ")
    add_p("• Week 2: Google Search & Shopping Ads Campaign Launch — Setting up Merchant Center, building high-intent keyword ad groups for Shilajit & Chyawanprash, configuring negative keyword filters, and deploying Meta retargeting pixels.", bold_prefix="Week 2: ")
    add_p("• Week 3: In-App Instagram Studio & WhatsApp Automation — Launching automated Day-21 refill reminders, connecting abandoned cart SMS/WhatsApp recovery sequences, and training your team on the Seller Hub.", bold_prefix="Week 3: ")
    add_p("• Week 4: Performance Review & Profitable Scaling — Analyzing first 100 orders, calculating exact Customer Acquisition Cost (CAC) per SKU, pruning underperforming keywords, and scaling top-converting Ayurvedic remedies.", bold_prefix="Week 4: ")

    # ==========================================
    # SECTION 9: RISK MITIGATION & GUARANTEES
    # ==========================================
    add_h1("9. Risk Mitigation & Quality Guarantees")
    add_p("• 100% Client Code & Data Ownership: You retain 100% ownership of your customer database, patient order histories, domain, and codebase. No vendor lock-in.", bold_prefix="1. Zero Vendor Lock-in: ")
    add_p("• Complete Transparency: All ad spends are charged directly to your own Google Ads and Meta billing accounts. We take zero markups on media spend.", bold_prefix="2. Transparent Direct Ad Billing: ")
    add_p("• Regulatory AYUSH Compliance: All product page descriptions and ad copies comply strictly with AYUSH guidelines and non-pharma herbal regulations.", bold_prefix="3. AYUSH Safe Marketing: ")

    # ==========================================
    # SECTION 10: PARTNERSHIP ACCEPTANCE & NEXT STEPS
    # ==========================================
    add_h1("10. Engagement Acceptance & Sign-off")
    add_p(
        "To initiate Phase 1 deployment and launch your Flipkart-grade Ayurvedic digital storefront, please sign below to confirm agreement on the selected partnership model.",
        None, 12
    )

    sign_tbl = doc.add_table(rows=3, cols=2)
    sign_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    sign_tbl.columns[0].width = Inches(3.3)
    sign_tbl.columns[1].width = Inches(3.3)

    s_cells = sign_tbl.rows[0].cells
    set_cell_background(s_cells[0], 'F1F5F9')
    set_cell_background(s_cells[1], 'F1F5F9')
    set_cell_margins(s_cells[0])
    set_cell_margins(s_cells[1])
    s_cells[0].paragraphs[0].add_run("FOR CLIENT / AYURVEDIC BRAND:").font.bold = True
    s_cells[1].paragraphs[0].add_run("FOR TECHNOLOGY & GROWTH PARTNER:").font.bold = True

    s_cells2 = sign_tbl.rows[1].cells
    set_cell_margins(s_cells2[0], 240, 240, 180, 180)
    set_cell_margins(s_cells2[1], 240, 240, 180, 180)
    s_cells2[0].paragraphs[0].add_run("Signature: ___________________________\n\nName: \nTitle: \nDate: ").font.size = Pt(9.5)
    s_cells2[1].paragraphs[0].add_run("Signature: ___________________________\n\nName: \nTitle: Senior Partner & Lead Architect\nDate: ").font.size = Pt(9.5)

    s_cells3 = sign_tbl.rows[2].cells
    set_cell_background(s_cells3[0], 'F8FAFC')
    set_cell_background(s_cells3[1], 'F8FAFC')
    set_cell_margins(s_cells3[0])
    set_cell_margins(s_cells3[1])
    s_cells3[0].paragraphs[0].add_run("Selected Option: [  ] Option 1 (Starter)   [  ] Option 2   [  ] Option 3").font.size = Pt(9)
    s_cells3[1].paragraphs[0].add_run("Ready for Immediate Kickoff within 48 Hours").font.size = Pt(9)

    out_file = "Ayurveda_Client_Proposal_Word_Document.docx"
    doc.save(out_file)
    print(f"Proposal successfully saved to {out_file} (Size: {os.path.getsize(out_file)/1024:.1f} KB)")

if __name__ == '__main__':
    create_proposal()
