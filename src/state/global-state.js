import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ls from 'local-storage';
import GlobalContext from './global-context';

export default class GlobalState extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            usageRecord: null,
            billingLines: [],
            testCaseResult: null,
            isBillingLineModal: false,
            chargeFactorRequest: [],
            ratingCodeRequest: [],
            billingLineTextRequest: []
        };
    }

    componentDidMount = () => {        

        const chargeFactorUrl = 'https://billingyairtest.gototech.co/billinggoto_testcases/get-charge-factor';
        const ratingCodeUrl = 'https://billingyairtest.gototech.co/billinggoto_testcases/get-rating-code';
        const billingLineTextUrl = 'https://billingyairtest.gototech.co/billinggoto_testcases/get-billingline-text';

        let fetchUrls = [];     
        
        if(ls.get('chargeFactorRequest')) {
            this.setState({
                chargeFactorRequest: ls.get('chargeFactorRequest')
            });         
        } else {
            fetchUrls.push(chargeFactorUrl);
        }

        if(ls.get('ratingCodeRequest')) {
            this.setState({
                ratingCodeRequest: ls.get('ratingCodeRequest')
            });         
        } else {
            fetchUrls.push(ratingCodeUrl);
        }

        if(ls.get('billingLineTextRequest')) {
            this.setState({
                billingLineTextRequest: ls.get('billingLineTextRequest')
            });         
        } else {
            fetchUrls.push(billingLineTextUrl);
        }

        if(fetchUrls.length > 0) {
            axios.all(fetchUrls.map(url => {
                return axios.get(url);
            })).then (axios.spread((...responses) => {                
                this.setState({
                    chargeFactorRequest: this.setResponseData(responses[0].data, 'chargeFactorRequest'),
                    ratingCodeRequest: this.setResponseData(responses[1].data, 'ratingCodeRequest'),
                    billingLineTextRequest: this.setResponseData(responses[2].data, 'billingLineTextRequest')
                });
    
            })).catch(err => {
                this.notify(`There is an error with getching ChargeFactor, RatingCode and BillinLineText: ${ err } `);
            });
        }   
    }  

    setResponseData = (response, lsName) => {
        let result = [];
        if(response.originalError) {
            this.notify(`There is an error with getting ${ lsName }: ${ response.originalError.info.message } `);
        }
        else if(response.length > 0) {
            result = response;
            ls.set(lsName, response);
        }

        return result;
    }

    notify = (msg) => {
        toast.info(msg, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 8000,
            draggable: false
          });
    } 
    

    isValidUsageRecordJSONString = usageRecord => {
        try {
            JSON.parse(usageRecord);
        } catch (e) {
            return false;
        }
        return true;
    }

    makeTestCase = (input, historyLocation) => {        
        const updateUsageRecord = input.trim();
        if(!updateUsageRecord && updateUsageRecord ===''){
            this.notify("usage record is empty");            
            return;
        }

        if(!this.isValidUsageRecordJSONString(updateUsageRecord)) {
            this.notify("usage record is not valid");            
            return;
        }

        if(this.state.billingLines.length === 0) {
            this.notify("Maybe you forgot to add a billing line?");            
            return;
        }

        const usageRecord = JSON.parse(updateUsageRecord);
        
        this.setState({ usageRecord });   

        this.createTesCase(usageRecord);         
        
        historyLocation.push("/output");

        setTimeout(() => { this.notify('Please send this JSON to Inna and Yair') }, 1000) ;
    }  
    
    createTesCase = (usageRecord) => {      
        const testCaseResult = {
            "TestType": 12,
            "Connection": 1,
            "Settings": {
                "MinimumMinutesForRateUnit": 4,
                "RunOnDemand": 1,
                "OnDemandCharge": 0
            },
            "UsageRecord": this.getUsageRecordTestCase(usageRecord),
            "AssertRecord": {
                "BillingLine": this.getBillingLinesTestCase(usageRecord[0].UsageID)
            }
        };

        this.setState({ testCaseResult }, () => {
            console.log(this.state.testCaseResult, 'testCaseResult');
          }); 
          
          
                
    }

    getUsageRecordTestCase = (usageRecord) => {        

        const results = usageRecord.map(record => {
            return {
                'UsageID': `#AutoTest-${ record.UsageID}`,               
                'Charge': record.Charge !== null ?
                                    record.Charge ? 1 : 0
                                   : null,
                'MemberID': record.MemberID ?  record.MemberID : null,           
                'UsageData': this.getUsageDataTestCase(record.UsageData)
                }         
        });       

        return results;
    }

    getUsageDataTestCase = (usageData) => {
            
        const result = usageData.map(item => {
            const itemJson = JSON.parse(item);

            const usageDataItemResult = {};

            for (let [key, value] of Object.entries(itemJson)) {
                usageDataItemResult[key] = value;               
            }   

            return usageDataItemResult;            
        });   
        
        return result;
    }

    getBillingLinesTestCase = (usageId) => {        
        const billingLines = this.state.billingLines;

        const result = billingLines.map(item => {
            const line = {
                'OrigCDRExtID': `#AutoTest-${ usageId }`
            };         

            if(item.sourceName) line.Source = item.source;
            if(item.chargeFactorID) line.p_ChargeFactorID = item.chargeFactorID;
            if(item.ratingCodeID) line.p_RatingCodeID = item.ratingCodeID;
            if(item.billingLineTextID) line.b_BillingLineTextID = item.billingLineTextID;
            if(item.fromDate) line.FromDate = item.fromDate;
            if(item.quantity !== undefined) line.Quantity = item.quantity;
            if(item.totalAmount !== undefined)  line.TotalAmount = item.totalAmount;
            
            return line;         
            
    });        
        
        return result;
    }

    openModal = () => {        
        this.setState({ isBillingLineModal: true });        
    }

    closeModal = () => {
        this.setState({ isBillingLineModal: false });
    }

    saveBillingLine = fields => {        
        const updateLines = [...this.state.billingLines];
        let idLine = updateLines.length === 0 ? 1 : updateLines[updateLines.length - 1].idLine + 1;        

        const newLine = {
            idLine: idLine 
        }

        if(fields.source !== "0") {
            newLine.source = parseInt(fields.source);
            newLine.sourceName = fields.sourceName;
        }

        if(fields.chargeFactorID !== "0") {
            newLine.chargeFactorID = parseInt(fields.chargeFactorID);
            newLine.chargeFactorName = fields.chargeFactorName;
        }

        if(fields.ratingCodeID !== "0") {
            newLine.ratingCodeID = parseInt(fields.ratingCodeID);
            newLine.ratingCodeName = fields.ratingCodeName;
        }

        if(fields.billingLineTextID !== "0") {
            newLine.billingLineTextID = parseInt(fields.billingLineTextID);
            newLine.billingLineTextName = fields.billingLineTextName;
        }

        if(fields.fromDate.toString().trim()) {
            newLine.fromDate = fields.fromDate;
        }       

        if(fields.quantity.toString().trim() !== '') {
            newLine.quantity = parseFloat(fields.quantity);
        }

        if(fields.totalAmount.toString().trim() !== '') {
            newLine.totalAmount = parseFloat(fields.totalAmount);
        }
       
        if(Object.keys(newLine).length <= 1) {
            this.notify("you should add at least one field");
            return;
        }
        

        updateLines.push(newLine);
        this.setState({ billingLines: updateLines});
    }

    removeLine = idLine => {
        const updateLines = [...this.state.billingLines];
        const updateLinesIndex = updateLines.findIndex(item => item.idLine === idLine);
        const updateItem = { ...updateLines[updateLinesIndex] };

        if(updateItem)
            updateLines.splice(updateLinesIndex, 1);

        this.setState({ billingLines: updateLines});
    }

    importBillingLinesByReservation = (reservationId, dbValue) => {      
      
        axios.get(`https://billingyairtest.gototech.co/billinggoto_testcases/billing-lines/${ reservationId }/${ dbValue }`)
        .then(response => response.data)
        .then(data => { 
            if(data.originalError) {
                this.notify(`BillingLine error fething DB: ${ data.originalError.info.message }`);
                return;
            }

            if(data.length === 0) {
                this.notify('There is no data for that reservation');
                return;
            }          
            data.map(line => this.saveBillingLine(line));            
        })
        .catch(err => {
            this.notify('BillingLine error fething DB');
            console.log(err, 'err')
        })
    }
   

    render() {
        const { usageRecord, 
                billingLines, 
                testCaseResult, 
                isBillingLineModal,
                chargeFactorRequest,
                ratingCodeRequest,
                billingLineTextRequest
            } = this.state;

        return(
            <GlobalContext.Provider
                value={{
                    usageRecord,
                    billingLines,
                    testCaseResult,
                    isBillingLineModal,
                    chargeFactorRequest,
                    ratingCodeRequest,
                    billingLineTextRequest,
                    makeTestCase: this.makeTestCase,
                    openModal: this.openModal,
                    closeModal: this.closeModal,
                    saveBillingLine: this.saveBillingLine,
                    removeLine: this.removeLine,
                    importBillingLinesByReservation: this.importBillingLinesByReservation,
                    notify: this.notify
                }}
            >
                { this.props.children }
            </GlobalContext.Provider>
        );
    }
}