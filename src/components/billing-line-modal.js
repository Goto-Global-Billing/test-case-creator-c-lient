import React from 'react';
import DatePicker from 'react-datepicker';
import GlobalContext from '../state/global-context';
import './billing-line-modal.css';

var moment = require('moment');

export default class BillinLineModal extends React.Component {   
    static contextType = GlobalContext;

    constructor(props) {
        super(props);
        
        this.state = {
            source: "0",
            sourceName: 'None',
            chargeFactorID: "0",
            chargeFactorName: 'None',
            ratingCodeID: "0",
            ratingCodeName: 'None',
            billingLineTextID: "0",
            billingLineTextName: "None",
            fromDate: this.formatDate(new Date()),
            fromDateNoFormat: new Date(),
            totalAmount: 0,
            quantity: 0                              
        };
    }   

    onSaveModal = () => {
        this.context.saveBillingLine(this.state);
        this.context.closeModal();
    }

    onSourceSelect = (selected) => {
        this.setState({ source: selected.value });
        this.setState({ sourceName: selected.options[selected.selectedIndex].text});
    }

    onChargeFactorSelect  = (selected) => {
        this.setState({ chargeFactorID: selected.value });
        this.setState({ chargeFactorName: selected.options[selected.selectedIndex].text});
    }

    onRatingCodeIDSelect = (selected) => {
        this.setState({ ratingCodeID: selected.value });
        this.setState({ ratingCodeName: selected.options[selected.selectedIndex].text});
    } 
    
    onBillingLineTextSelect = (selected) => {
        this.setState({ billingLineTextID: selected.value });
        this.setState({ billingLineTextName: selected.options[selected.selectedIndex].text});
    } 
    
    onChangeDate = (date) => {
        this.setState({ 
            fromDate: this.formatDate(date),
            fromDateNoFormat: date
        });        
    }

    formatDate = (date) => {
        return (moment(date).format("YYYY-MM-DD HH:mm:ss.00"));
    }    

    render() {
        const { source, 
                chargeFactorID, 
                ratingCodeID, 
                billingLineTextID,
                fromDateNoFormat, 
                totalAmount, 
                quantity                 
            } = this.state;
        if(!this.context.isBillingLineModal) return null;
        
        const { chargeFactorRequest, ratingCodeRequest, billingLineTextRequest } = this.context;
        
        return(                                  
            <div className="modal" id='billingLineModal'  role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add new Biiling Line</h5>
                        <button type="button" className="close" onClick={ this.context.closeModal } >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="input-group input-group-sm mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">Source</span>
                            </div> 
                            <select value={ source } onChange={ (e) => this.onSourceSelect(e.target) }  className='custom-select custom-select-sm'>
                                <option value="0">None</option>
                                <option value="1">A2A</option>
                                <option value="2">A2B</option>                                
                            </select>                            
                        </div>
                        <div className="input-group input-group-sm mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">ChargeFactor</span>
                            </div>
                            <select value={ chargeFactorID } onChange={ (e) => this.onChargeFactorSelect(e.target) }  className='custom-select custom-select-sm'>
                                <option value="0">None</option>
                                { chargeFactorRequest.length > 0 ?
                                    chargeFactorRequest.map( item => <option value={ item.ID } key={ item.ID }>{ item.Description }</option>) :
                                    null
                                }                                
                            </select>                            
                        </div>
                        <div className="input-group input-group-sm mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">RatingCode</span>
                            </div> 
                            <select value={ ratingCodeID } onChange={ (e) => this.onRatingCodeIDSelect(e.target) }  className='custom-select custom-select-sm'>
                                <option value="0">None</option>
                                { ratingCodeRequest.length > 0 ?
                                    ratingCodeRequest.map( item => <option value={ item.ID } key={ item.ID }>{ item.Description }</option>) :
                                    null
                                }                                                               
                            </select>                            
                        </div>
                        <div className="input-group input-group-sm mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">BillingLineText</span>
                            </div> 
                            <select value={ billingLineTextID } onChange={ (e) => this.onBillingLineTextSelect(e.target) }  className='custom-select custom-select-sm'>
                                <option value="0">None</option>
                                { billingLineTextRequest.length > 0 ?
                                    billingLineTextRequest.map( item => <option value={ item.ID } key={ item.ID }>{ item.Description }</option>) :
                                    null
                                }                                                               
                            </select>                            
                        </div>
                        <div className="input-group input-group-sm mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">FromDate</span>
                            </div>
                            <DatePicker
                                selected={ fromDateNoFormat }
                                onChange={ date => this.onChangeDate(date) }
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={ 1 }
                                timeCaption="time"
                                dateFormat="yyyy-MM-dd HH:mm:ss.00"
                                className='form-control'
                                />                           
                        </div>
                        <div className="input-group input-group-sm mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">Quantity</span>
                            </div> 
                            <input 
                                type="text" 
                                className="form-control" 
                                aria-label="Small"
                                value={ quantity }
                                onChange={ (e) => this.setState({ quantity: e.target.value }) }
                                />
                        </div>
                        <div className="input-group input-group-sm mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">TotalAmount</span>
                            </div> 
                            <input 
                                type="text" 
                                className="form-control" 
                                aria-label="Small"
                                value={ totalAmount }
                                onChange={ (e) => this.setState({ totalAmount: e.target.value }) }
                                />
                        </div>                         

                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={ () => this.onSaveModal() }>Save changes</button>
                            <button type="button" className="btn btn-secondary" onClick={ this.context.closeModal }>Close</button>
                        </div>
                    </div>
                </div>
            </div> 
        </div>           
            
        );
    }
    
}