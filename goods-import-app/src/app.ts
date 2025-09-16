import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import GoodsImportPage from './components/GoodsImportPage';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" component={GoodsImportPage} />
            </Switch>
        </Router>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));