'use strict';

const masterContactInfoAllowDelete = [
    'Legal',
    'Tech',
    'Tech Support'
]

const masterContactInfoAllowEditSenderEmailer = [
    'Legal',
    'Tech',
    'Sales'
]

const masterContactInfoAllowMainEdit = [
    'Legal',
    'Tech',
    'Tech Support'
]

const masterContactInfoDisallowedTypes = {
    'Legal':[],
    'Sales':[],
    'Tech':['primary', 'legal', 'owner', 'officer', 'proprietor'],
    'Tech Support':['primary', 'legal', 'owner', 'officer', 'proprietor']
}

module.exports = {
    masterContactInfoAllowDelete,
    masterContactInfoAllowEditSenderEmailer,
    masterContactInfoAllowMainEdit,
    masterContactInfoDisallowedTypes
};