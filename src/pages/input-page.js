import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import GlobalContext from '../state/global-context';
import Navigation from '../components/navigation';
import AssertRecord from '../components/assert-record';
import ImportByReservation from '../components/import-by-reservation';
import './input-page.css';

const InputPage  = ({ history }) => {
   const [value, setValue] = useState(''); 

   const importUsageRecordByReservation = (reservationId, dbValue) => {
        axios.get(`https://billingyairtest.gototech.co/billinggoto_testcases/usage-record/${ reservationId }/${ dbValue }`)
        .then(response => response.data)
        .then(data => { 
            if(data.originalError) {
                notify(data.originalError.message);
                return;
            }

            if(data.length === 0) {
                notify('There is no data for that reservation');
                return;
            }          
            makeUsageRecordInput(data);            
        })
        .catch(err => {
            notify('The is error fething DB');
            console.log(err, 'err')
        })
   }

   const makeUsageRecordInput = data => {
       const result = [];

       const usageReocrd = {
           'UsageID': data[0].UsageID,
           'Charge': data[0].Charge,
           'UsageData': data.map(item => item.UsageData)
       }

       result.push(usageReocrd);

       setValue(JSON.stringify(result));
   }  

   const notify = (msg) => {
        toast.info(msg, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 8000,
            draggable: false
        });
} 
   
    return(
        <GlobalContext.Consumer>
            { context => (
                <React.Fragment>
                    <Navigation />
                    <div className='inputContainer' >
                        <div>
                            <div className='usageRecord'>
                                <ImportByReservation
                                    title='Import Usage Record of that reservation' 
                                    onClickHandler = { importUsageRecordByReservation }
                                />                                                                                            
                                <textarea  
                                    rows='14' 
                                    cols='50'                                        
                                    placeholder='Please insert UsageRecord in Json Format'
                                    value={ value }
                                    onChange={ e => setValue(e.target.value) }
                                />                            
                               
                            </div>                            
                            <AssertRecord />   
                        </div>
                        <button type="button" className="btn btn-primary" onClick={ context.makeTestCase.bind(this, value, history) }>Add to Test Case</button>                 
                    </div>                   
                </React.Fragment>
            )}
        </GlobalContext.Consumer>            
        );
    
}

export default InputPage;
