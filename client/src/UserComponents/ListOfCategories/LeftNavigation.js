import React,{Component} from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { setCurrentCategory, getCurrentCategory } from '../../actions/currentCategory';

import {Nav, Navbar, NavItem, MenuItem, NavDropdown} from 'react-bootstrap'
// Include all foundation (base) styles once in your main entry point:
// import "metro-ui-components/lib/css/metro-ui.foundation.css";

// Then import react components
import { VerticalHeader, VerticalHeaderButton, VerticalHeaderDrawer, Panel, Bar, BarItem, StoreID, 
    ChoiceList, ChoiceListLink, Icon, PanelHeader, Input, IconButton,
    Address } from "metro-ui-components";


class LeftNavigation extends Component{

    constructor(props){
        super(props);
        this.state = {
          selectedCapability:true,
          openDrawer: true
        }

        this.selectOneCapability = this.selectOneCapability.bind(this);
        this.setDrawer = this.setDrawer.bind(this);
    }

    selectOneCapability(){
        this.setState({selectedCapability: true})
    }

    setDrawer(){
        this.setState({openDrawer: !this.state.openDrawer})
    }

    render(){
    
        const {current_category, is_set} = this.props;
        return(

                <VerticalHeader logoVariant="metro-united" logoLinkProps={{href: '#', onClick: this.setDrawer}} >
                <VerticalHeaderButton iconType="apps" htmlTitle="Search" onClick={this.setDrawer} />

                <VerticalHeaderDrawer active={this.state.openDrawer} requestClose={ this.setDrawer } >
                <Panel>
                <PanelHeader>
                <Bar>
                <BarItem>
                <h2>
                Capabilities panel
                </h2>
                </BarItem>
                <BarItem>
                <IconButton
                type="close"
                className="metro-blue"
                TagName="button"
                onClick={()=>{this.setState({openDrawer: false})}}
                />
                </BarItem>
                </Bar>
                </PanelHeader>

                {this.props.capabilities.map(function(capability,index){
                    return(
                        <span key={capability._id}>
                        <Address >
                        <strong>
                        {capability.name}
                        </strong>
                        <br/>
                        </Address>
                        {capability.categories.map(function(category,index){
                            return(
                                <ChoiceList compact key={category._id}  
                                onClick={()=>{console.log("ceva")}}>
                                <ChoiceListLink selected  onClick={()=>{this.props.setCurrentCategory(capability._id,category); this.setState({openDrawer: false})}}>
                                <Bar>
                                <BarItem>
                                {category.name}
                                </BarItem>
                                <BarItem>
                                {category._id==current_category._id? 
                                <Icon type="check" />
                                :
                                null
                                }
                                </BarItem>
                                </Bar>
                                </ChoiceListLink>
                                </ChoiceList>
                            )
                        }.bind(this))}
                        </span>
                    )
                }.bind(this))}
                
                </Panel>
                </VerticalHeaderDrawer>
                </VerticalHeader>

        )
    }
}

LeftNavigation.propTypes = {
    setCurrentCategory: PropTypes.func.isRequired,
    getCurrentCategory: PropTypes.func.isRequired,
    current_category: PropTypes.object.isRequired,
    is_set: PropTypes.bool.isRequired,
    capabilities: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
    is_set: state.currentCategory.is_set,
    current_category: state.currentCategory.current_category
})

export default connect(mapStateToProps, { setCurrentCategory, getCurrentCategory })(LeftNavigation);