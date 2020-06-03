import React from 'react';
import GlobalContext from '../state/global-context';
import ImportByReservation from './import-by-reservation';
import './assert-record.css';

export default class AssertRecord extends React.Component {
    static contextType = GlobalContext;    

    render() {

        return( 
            <div className='container' >
                <ImportByReservation
                    title='Import Billing Lines of that reservation'
                    onClickHandler={ this.context.importBillingLinesByReservation }
                />          
                <div className='border overflow-auto asserRecord'>
                    <button
                        className='btn btn-success addLineBtn'
                        onClick={this.context.openModal.bind(this)}>
                        Add Biiling Line
                            </button>
                    {this.context.billingLines.length <= 0 && <h5 className='noLines'>No item in the Assert Record</h5>}
                    <ul>
                        {this.context.billingLines.map((lineItem, idx) => (
                            <li key={idx}>
                                <ul className='lineItem'>
                                    <button onClick={this.context.removeLine.bind(this, lineItem.idLine)} type="button" className="close" >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    {lineItem.source &&
                                        <li>
                                            <strong>Source: </strong>{lineItem.sourceName}
                                        </li>
                                    }
                                    {lineItem.chargeFactorID &&
                                        <li>
                                            <strong>ChargeFactor: </strong>{lineItem.chargeFactorName}
                                        </li>
                                    }
                                    {lineItem.ratingCodeID &&
                                        <li>
                                            <strong>RatingCode: </strong>{lineItem.ratingCodeName}
                                        </li>
                                    }
                                    {lineItem.billingLineTextID &&
                                        <li>
                                            <strong>BillingLineText: </strong>{lineItem.billingLineTextName}
                                        </li>
                                    }
                                    {lineItem.fromDate &&
                                        <li>
                                            <strong>FromDate: </strong>{lineItem.fromDate}
                                        </li>
                                    }
                                    {lineItem.quantity !== undefined &&
                                        <li>
                                            <strong>Quantity: </strong>{lineItem.quantity}
                                        </li>
                                    }
                                    {lineItem.totalAmount !== undefined &&
                                        <li>
                                            <strong>TotalAmount: </strong>{lineItem.totalAmount}
                                        </li>
                                    }
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div> 
            </div>                     
        );
    
    }    
}