let crmData = { businesses: [], customers: [] };

// Load CRM Data
async function loadCRMData() {
    try {
        const response = await fetch('./Resources/Scripts/crm.json');
        crmData = await response.json();
        console.log("CRM Database loaded.");
        renderCustomerList();
    } catch (error) {
        console.error("Error loading CRM data:", error);
    }
}

// Helper: Get Business details for a customer
function getBusiness(businessId) {
    return crmData.businesses.find(b => b.id === businessId) || { name: "Individual", address: "N/A" };
}

// UI: Render the List (3D Card Style)
function renderCustomerList() {
    const container = document.getElementById('crm-content');
    if (!container) return;

    container.innerHTML = crmData.customers.map(cust => {
        const biz = getBusiness(cust.businessId);
        return `
            <div class="card-3d crm-customer-card" onclick="viewCustomerDetails('${cust.id}')">
                <div class="customer-info">
                    <strong>${cust.name}</strong>
                    <span class="business-tag">${biz.name}</span>
                </div>
                <div class="customer-contact">
                    <p>${cust.email}</p>
                    <p>${cust.phone}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Initialize CRM when the script loads
loadCRMData();