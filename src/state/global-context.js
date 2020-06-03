import React from 'react';

export default React.createContext({
    usageRecord: null,
    billingLines: [],
    testCaseResult: null,
    isBillingLineModal: false,
    chargeFactorRequest: [],
    ratingCodeRequest: [],
    billingLineTextRequest: [],
    makeTestCase: (input, historyLocation) => {},
    openModal: () => {},
    closeModal: () => {},
    saveBillingLine: fields => {},
    removeLine: idLine => {},
    importBillingLinesByReservation: (reservationId, db) => {},
    notify: msg => {}
});