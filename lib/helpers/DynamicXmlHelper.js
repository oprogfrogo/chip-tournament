const xml2js = require('xml2js');
const subMerchantCreateTemplate = require('../../lib/templates/subMerchantCreateTemplate');
const subMerchantUpdateTemplate = require('../../lib/templates/subMerchantUpdateTemplate');
const legalEntityTemplate = require('../../lib/templates/legalEntityTemplate');
const legalEntityUpdateTemplate = require('../../lib/templates/legalEntityUpdateTemplate');
const legalEntityPrincipalCreateTemplate = require('../../lib/templates/legalEntityPrincipalCreateTemplate');

class DynamicXmlHelper {

    // Convert form data into XML for different operations with dynamic attribute mappings.
    static convertFormToXml(formData, rootName, attributeMappings=[]) {
        
        // Extract the root name content and process the xmlns field
        const rootContent = formData;

        // Remove the _xmlns from the JSON and handle it as an attribute
        const xmlnsValue = rootContent['_xmlns'];
        delete rootContent['_xmlns'];

        // // Handle fields where enabled should be treated as an attribute
        this.addAttributes(rootContent, attributeMappings);

        // Create an XML builder with the correct namespace and root name
        const builder = new xml2js.Builder({
            headless: true,
            renderOpts: { pretty: true },
            rootName: rootName,
            attrkey: '@',
        });

        // Add the xmlns as an attribute to the root
        rootContent['@'] = { xmlns: xmlnsValue };

        // Convert the JSON to XML
        return builder.buildObject(rootContent);
    }

    // Function to move the specified key-value pairs to be treated as attributes for specific fields.
    static addAttributes(data, attributeMappings) {
        // Loop through the attributeMappings array to find which fields need to have the "enabled" attribute added.
        attributeMappings.forEach((field) => {
            if (data[field] && data[field]._enabled) {
                // Add the "enabled" value as an attribute for the field
                data[field]['@'] = { enabled: data[field]._enabled };
    
                // Remove the 'enabled' key from the field data since it's now an attribute
                delete data[field]._enabled;
            }
        });
    }
    
    // Function to Dyanamically Mapping of create submerchant Form to predefined template of subMerchant
    static mapCreateSubMerchantFormToTemplate(formData) {
        const subMerchantData = JSON.parse(JSON.stringify(subMerchantCreateTemplate));

        // Map form data to the template structure
        subMerchantData.subMerchantCreateRequest.merchantName = formData.merchantName;
        subMerchantData.subMerchantCreateRequest.discoverConveyedMid = formData.discoverConveyedMid;
        subMerchantData.subMerchantCreateRequest.url = formData.url;
        subMerchantData.subMerchantCreateRequest.customerServiceNumber = formData.customerServiceNumber;
        subMerchantData.subMerchantCreateRequest.hardCodedBillingDescriptor = formData.hardCodedBillingDescriptor;
        subMerchantData.subMerchantCreateRequest.maxTransactionAmount = formData.maxTransactionAmount;
        subMerchantData.subMerchantCreateRequest.purchaseCurrency = formData.purchaseCurrency;
        subMerchantData.subMerchantCreateRequest.merchantCategoryCode = formData.merchantCategoryCode;
        subMerchantData.subMerchantCreateRequest.bankRoutingNumber = formData.bankRoutingNumber;
        subMerchantData.subMerchantCreateRequest.bankAccountNumber = formData.bankAccountNumber;
        subMerchantData.subMerchantCreateRequest.pspMerchantId = formData.pspMerchantId;

        // Fraud and AmexAcquired mapped as attributes
        subMerchantData.subMerchantCreateRequest.fraud._enabled = formData.fraud === "true" ? "true" : "false";

        // Address Mapping
        subMerchantData.subMerchantCreateRequest.address.streetAddress1 = formData.streetAddress1;
        subMerchantData.subMerchantCreateRequest.address.streetAddress2 = formData.streetAddress2 || '';
        subMerchantData.subMerchantCreateRequest.address.city = formData.city;
        subMerchantData.subMerchantCreateRequest.address.stateProvince = formData.stateProvince;
        subMerchantData.subMerchantCreateRequest.address.postalCode = formData.postalCode;
        subMerchantData.subMerchantCreateRequest.address.countryCode = formData.countryCode;

        // Primary Contact Mapping
        subMerchantData.subMerchantCreateRequest.primaryContact.firstName = formData.firstName;
        subMerchantData.subMerchantCreateRequest.primaryContact.lastName = formData.lastName;
        subMerchantData.subMerchantCreateRequest.primaryContact.emailAddress = formData.emailAddress;
        subMerchantData.subMerchantCreateRequest.primaryContact.phone = formData.phone;

        // Additional mappings as needed
        subMerchantData.subMerchantCreateRequest.createCredentials = formData.createCredentials  === "true" ? "true" : "false";
        
        subMerchantData.subMerchantCreateRequest.settlementCurrency = formData.settlementCurrency;

        // Add the _xmlns attribute to the root element
        subMerchantData.subMerchantCreateRequest._xmlns = "http://payfac.vantivcnp.com/api/merchant/onboard";

        return subMerchantData['subMerchantCreateRequest'];
    }

     // Function to Dyanamically Mapping of submerchant update Form to predined update template of subMerchant
     static mapUpdateSubMerchantFormToTemplate(formData) {
        const subMerchantData = JSON.parse(JSON.stringify(subMerchantUpdateTemplate));

        // Map form data to the template structure
        subMerchantData.subMerchantUpdateRequest.discoverConveyedMid = formData.discoverConveyedMid;
        subMerchantData.subMerchantUpdateRequest.url = formData.url;
        subMerchantData.subMerchantUpdateRequest.customerServiceNumber = formData.customerServiceNumber;
        subMerchantData.subMerchantUpdateRequest.hardCodedBillingDescriptor = formData.hardCodedBillingDescriptor;
        subMerchantData.subMerchantUpdateRequest.maxTransactionAmount = formData.maxTransactionAmount;
        subMerchantData.subMerchantUpdateRequest.bankRoutingNumber = formData.bankRoutingNumber;
        subMerchantData.subMerchantUpdateRequest.bankAccountNumber = formData.bankAccountNumber;

        // Fraud and AmexAcquired mapped as attributes
        subMerchantData.subMerchantUpdateRequest.fraud._enabled = formData.fraud === "true" ? "true" : "false";

        // Address Mapping
        subMerchantData.subMerchantUpdateRequest.address.streetAddress1 = formData.streetAddress1;
        subMerchantData.subMerchantUpdateRequest.address.streetAddress2 = formData.streetAddress2 || '';
        subMerchantData.subMerchantUpdateRequest.address.city = formData.city;
        subMerchantData.subMerchantUpdateRequest.address.stateProvince = formData.stateProvince;
        subMerchantData.subMerchantUpdateRequest.address.postalCode = formData.postalCode;

        // Primary Contact Mapping
        subMerchantData.subMerchantUpdateRequest.primaryContact.firstName = formData.firstName;
        subMerchantData.subMerchantUpdateRequest.primaryContact.lastName = formData.lastName;

        // Additional mappings as needed
        if(formData.createCredentials  === "true"){
            subMerchantData.subMerchantUpdateRequest.createCredentials = formData.createCredentials  === "true" ? "true" : "false";
        } else {
            delete subMerchantData.subMerchantUpdateRequest.createCredentials;
        }

        // Add the _xmlns attribute to the root element
        subMerchantData.subMerchantUpdateRequest._xmlns = "http://payfac.vantivcnp.com/api/merchant/onboard";

        return subMerchantData['subMerchantUpdateRequest'];
    }

    // Function to dynamically map form data to predefined legalEntity template
    static mapLegelEnitityFormToTemplate(formData) {
        const legalEntityData = JSON.parse(JSON.stringify(legalEntityTemplate));
    
        // Legal Entity Mapping
        legalEntityData.legalEntityCreateRequest.legalEntityName = formData.legalEntityName;
        legalEntityData.legalEntityCreateRequest.legalEntityType = formData.legalEntityType;
        legalEntityData.legalEntityCreateRequest.legalEntityOwnershipType = formData.legalEntityOwnershipType;
        legalEntityData.legalEntityCreateRequest.doingBusinessAs = formData.doingBusinessAs || '';
        legalEntityData.legalEntityCreateRequest.taxId = formData.taxId;
        legalEntityData.legalEntityCreateRequest.contactPhone = formData.contactPhone;
        legalEntityData.legalEntityCreateRequest.annualCreditCardSalesVolume = formData.annualCreditCardSalesVolume;
        legalEntityData.legalEntityCreateRequest.hasAcceptedCreditCards = formData.hasAcceptedCreditCards === "true" ? "true" : "false";
    
        // Legal Entity Address Mapping
        legalEntityData.legalEntityCreateRequest.address.streetAddress1 = formData.legalEntityStreetAddress1;
        legalEntityData.legalEntityCreateRequest.address.streetAddress2 = formData.legalEntityStreetAddress2 || '';
        legalEntityData.legalEntityCreateRequest.address.city = formData.legalEntityCity;
        legalEntityData.legalEntityCreateRequest.address.stateProvince = formData.legalEntityStateProvince;
        legalEntityData.legalEntityCreateRequest.address.postalCode = formData.legalEntityPostalCode;
        legalEntityData.legalEntityCreateRequest.address.countryCode = formData.legalEntityCountryCode;

        // Principal Mapping
        legalEntityData.legalEntityCreateRequest.principal.title = formData.title;
        legalEntityData.legalEntityCreateRequest.principal.firstName = formData.firstName;
        legalEntityData.legalEntityCreateRequest.principal.lastName = formData.lastName;
        legalEntityData.legalEntityCreateRequest.principal.emailAddress = formData.emailAddress;
        legalEntityData.legalEntityCreateRequest.principal.ssn = formData.ssn;
        legalEntityData.legalEntityCreateRequest.principal.contactPhone = formData.principalContactPhone;
        legalEntityData.legalEntityCreateRequest.principal.dateOfBirth = formData.dateOfBirth;
        legalEntityData.legalEntityCreateRequest.principal.driversLicense = formData.driversLicense;
        legalEntityData.legalEntityCreateRequest.principal.driversLicenseState = formData.driversLicenseState;
    
        // Principal Address Mapping
        legalEntityData.legalEntityCreateRequest.principal.address.streetAddress1 = formData.principalStreetAddress1;
        legalEntityData.legalEntityCreateRequest.principal.address.streetAddress2 = formData.principalStreetAddress2 || '';
        legalEntityData.legalEntityCreateRequest.principal.address.city = formData.principalCity;
        legalEntityData.legalEntityCreateRequest.principal.address.stateProvince = formData.principalStateProvince;
        legalEntityData.legalEntityCreateRequest.principal.address.postalCode = formData.principalPostalCode;
        legalEntityData.legalEntityCreateRequest.principal.address.countryCode = formData.principalCountryCode;

        legalEntityData.legalEntityCreateRequest.principal.stakePercent = formData.stakePercent;
    
        // Optional Mappings
        // legalEntityData.legalEntityCreateRequest.yearsInBusiness = formData.yearsInBusiness || '';
    
        // Add the _xmlns attribute to the root element
        legalEntityData.legalEntityCreateRequest._xmlns = "http://payfac.vantivcnp.com/api/merchant/onboard";
    
        return legalEntityData['legalEntityCreateRequest'];
    }

    // Function to dynamically map form data to predefined legalEntity update template
    static mapLegalEntityFormToUpdateTemplate(formData) {
        const legalEntityData = JSON.parse(JSON.stringify(legalEntityUpdateTemplate));

        // Legal Entity Address Mapping
        legalEntityData.legalEntityUpdateRequest.address.streetAddress1 = formData.legalEntityStreetAddress1;

         // Conditionally include streetAddress2 only if it has a value
        if (formData.legalEntityStreetAddress2 && formData.legalEntityStreetAddress2.trim() !== '') {
            legalEntityData.legalEntityUpdateRequest.address.streetAddress2 = formData.legalEntityStreetAddress2;
        } else {
            // If streetAddress2 is empty, delete it from the object
            delete legalEntityData.legalEntityUpdateRequest.address.streetAddress2;
        }
        legalEntityData.legalEntityUpdateRequest.address.city = formData.legalEntityCity;
        legalEntityData.legalEntityUpdateRequest.address.stateProvince = formData.legalEntityStateProvince;
        legalEntityData.legalEntityUpdateRequest.address.postalCode = formData.legalEntityPostalCode;
        legalEntityData.legalEntityUpdateRequest.address.countryCode = formData.legalEntityCountryCode;

        // Contact Phone and DBA Mapping
        legalEntityData.legalEntityUpdateRequest.contactPhone = formData.contactPhone;
        legalEntityData.legalEntityUpdateRequest.doingBusinessAs = formData.doingBusinessAs || '';
        
        // Sales Volume and Credit Card Acceptance
        legalEntityData.legalEntityUpdateRequest.annualCreditCardSalesVolume = formData.annualCreditCardSalesVolume;
        legalEntityData.legalEntityUpdateRequest.hasAcceptedCreditCards = formData.hasAcceptedCreditCards === "true" ? "true" : "false";

        // // Principal Mapping
        // legalEntityData.legalEntityUpdateRequest.principal.principalId = formData.principalId;
        // legalEntityData.legalEntityUpdateRequest.principal.title = formData.title;
        // legalEntityData.legalEntityUpdateRequest.principal.emailAddress = formData.emailAddress;
        // legalEntityData.legalEntityUpdateRequest.principal.contactPhone = formData.principalContactPhone;

        // // Principal Address Mapping
        // legalEntityData.legalEntityUpdateRequest.principal.address.streetAddress1 = formData.principalStreetAddress1;
        // legalEntityData.legalEntityUpdateRequest.principal.address.city = formData.principalCity;
        // legalEntityData.legalEntityUpdateRequest.principal.address.stateProvince = formData.principalStateProvince;
        // legalEntityData.legalEntityUpdateRequest.principal.address.postalCode = formData.principalPostalCode;
        // legalEntityData.legalEntityUpdateRequest.principal.address.countryCode = formData.principalCountryCode;

        // // Principal Background Check Fields Mapping
        // legalEntityData.legalEntityUpdateRequest.principal.backgroundCheckFields.firstName = formData.firstName;
        // legalEntityData.legalEntityUpdateRequest.principal.backgroundCheckFields.lastName = formData.lastName;
        // legalEntityData.legalEntityUpdateRequest.principal.backgroundCheckFields.ssn = formData.ssn;
        // legalEntityData.legalEntityUpdateRequest.principal.backgroundCheckFields.dateOfBirth = formData.dateOfBirth;
        // legalEntityData.legalEntityUpdateRequest.principal.backgroundCheckFields.driversLicense = formData.driversLicense;
        // legalEntityData.legalEntityUpdateRequest.principal.backgroundCheckFields.driversLicenseState = formData.driversLicenseState;

        // Background Check for Legal Entity (Legal Entity Name, Type, and Tax ID)
        legalEntityData.legalEntityUpdateRequest.backgroundCheckFields.legalEntityName = formData.legalEntityName;
        legalEntityData.legalEntityUpdateRequest.backgroundCheckFields.legalEntityType = formData.legalEntityType;
        legalEntityData.legalEntityUpdateRequest.backgroundCheckFields.taxId = formData.taxId;

        // Add the _xmlns attribute to the root element
        legalEntityData.legalEntityUpdateRequest._xmlns = "http://payfac.vantivcnp.com/api/merchant/onboard";

        return legalEntityData['legalEntityUpdateRequest'];
    }

    // Function to dynamically map form data to predefined legalEntityPrincipalCreateRequest template
    static mapCreatePrincipalFormToTemplate(formData) {
        const principalData = JSON.parse(JSON.stringify(legalEntityPrincipalCreateTemplate));

        // Principal Mapping
        principalData.legalEntityPrincipalCreateRequest.principal.title = formData.title;
        principalData.legalEntityPrincipalCreateRequest.principal.firstName = formData.firstName;
        principalData.legalEntityPrincipalCreateRequest.principal.lastName = formData.lastName;
        principalData.legalEntityPrincipalCreateRequest.principal.emailAddress = formData.emailAddress;
        principalData.legalEntityPrincipalCreateRequest.principal.ssn = formData.ssn;
        principalData.legalEntityPrincipalCreateRequest.principal.contactPhone = formData.contactPhone;
        principalData.legalEntityPrincipalCreateRequest.principal.dateOfBirth = formData.dateOfBirth;

        // Principal Address Mapping
        principalData.legalEntityPrincipalCreateRequest.principal.address.streetAddress1 = formData.principalStreetAddress1;
        principalData.legalEntityPrincipalCreateRequest.principal.address.streetAddress2 = formData.principalStreetAddress2 || ''; // Optional
        principalData.legalEntityPrincipalCreateRequest.principal.address.city = formData.principalCity;
        principalData.legalEntityPrincipalCreateRequest.principal.address.stateProvince = formData.principalStateProvince;
        principalData.legalEntityPrincipalCreateRequest.principal.address.postalCode = formData.principalPostalCode;
        principalData.legalEntityPrincipalCreateRequest.principal.address.countryCode = formData.principalCountryCode;

        // Stake Percent Mapping
        principalData.legalEntityPrincipalCreateRequest.principal.stakePercent = formData.stakePercent;

        // Add the _xmlns attribute
        principalData.legalEntityPrincipalCreateRequest._xmlns = "http://payfac.vantivcnp.com/api/merchant/onboard";

        return principalData['legalEntityPrincipalCreateRequest'];
    }

    // Extract principal data from the formData
    static extractPrincipalData(formData) {
        return {
            title: formData.title,
            firstName: formData.firstName,
            lastName: formData.lastName,
            ssn: formData.ssn,
            emailAddress: formData.emailAddress,
            principalContactPhone: formData.principalContactPhone,
            dateOfBirth: formData.dateOfBirth,
            driversLicense: formData.driversLicense,
            driversLicenseState: formData.driversLicenseState,
            principalStreetAddress1: formData.principalStreetAddress1,
            principalStreetAddress2: formData.principalStreetAddress2 || '',
            principalCity: formData.principalCity,
            principalStateProvince: formData.principalStateProvince,
            principalPostalCode: formData.principalPostalCode,
            principalCountryCode: formData.principalCountryCode,
            stakePercent: formData.stakePercent
        };
    }
}

module.exports = DynamicXmlHelper;