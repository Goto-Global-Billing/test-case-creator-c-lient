import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ImportByReservation = props => {
    const {title, onClickHandler } = props;   

    const [value, setValue] = useState('');
    const [ dbValue, setDBValue ] = useState("1");

    const onChangeReservationId = value => {       
        const reg = new RegExp(/^\d+$/);
        if(!reg.test(value)) {
            notify('Please check reservationId. It should be only digit number');
            return;
        }

        setValue(value);
   }

   const notify = (msg) => {
        toast.info(msg, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 8000,
            draggable: false
        });
    } 


    return(
        <div className="input-group mb-3">
            <input
                type="text"
                className="form-control"
                placeholder="ReservationId"
                value={value}
                onChange={(e) => onChangeReservationId(e.target.value)} 
            />
            <select value={ dbValue } onChange={ (e) => setDBValue(e.target.value) } className="custom-select">               
                <option value="1">Current DB</option>
                <option value="2">Old DB</option>
            </select>
            <div className="input-group-append">
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => onClickHandler(value, dbValue)}
                >{ title }
                                        </button>
            </div>
        </div>   
    )
}

export default ImportByReservation;