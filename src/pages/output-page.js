import React from 'react';
import  JSONPretty from 'react-json-pretty';
import GlobalContext from '../state/global-context';
import Navigation from '../components/navigation';
import './output-page.css';


export default class OutputPage extends React.Component {
    static contextType = GlobalContext;    

    render() {      

        if(this.context.testCaseResult == null) 
            return (
                <React.Fragment>
                    <Navigation />
                    <h5 style={ {textAlign:"center"} }>No any Test Case</h5>    
                </React.Fragment>
                
            ); 

        return (           
            <React.Fragment>
                <Navigation />                
                <main className='outputContainer'>
                    <JSONPretty id="json-pretty" data={ this.context.testCaseResult }></JSONPretty>
                </main>                     
            </React.Fragment>
          
        );
    }
    
}