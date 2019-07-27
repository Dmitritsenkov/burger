import React, {Component} from 'react';
import { connect } from 'react-redux';
import Aux  from '../../hoc/Auxiliary/auxiliary';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/BuildControls/BuildControls';
import axios from '../../axios-orders';

import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component {

	state = {
		purchasing: false,
	}

	componentDidMount(){
		this.props.onInitIngredients()
	}

	updatePurchaseState = (newIngredients) => {
		let sum = Object.keys(newIngredients).map((ingt)=>{
			return newIngredients[ingt];
		})
		.reduce((sum, el)=>{
			return sum + el;
		}, 0);

		return sum > 0;
	}

	// addIngredients = (type) => {
	// 	let oldIngredientCount = this.state.ingredients[type];
	// 	let newIngredientCount = oldIngredientCount + 1;
	// 	let newIngredients = {...this.state.ingredients};
	// 	newIngredients[type] = newIngredientCount;

	// 	let oldTotalPrice = this.state.totalPrice;
	// 	let newTotalPrice  = oldTotalPrice + INGREDIENT_PRICES[type];

	// 	this.updatePurchaseState(newIngredients);
	// 	this.setState({ingredients: newIngredients, totalPrice: newTotalPrice});
	// }


	// removeIngredients = (type) => {
	// 	let oldIngredientCount = this.state.ingredients[type];

	// 	if(oldIngredientCount <= 0){
	// 		return;
	// 	}			

	// 	let newIngredientCount = oldIngredientCount - 1;
	// 	let newIngredients = {...this.state.ingredients}
	// 	newIngredients[type] = newIngredientCount;

	// 	let oldTotalPrice = this.state.totalPrice;
	// 	let newTotalPrice  = oldTotalPrice - INGREDIENT_PRICES[type];

	// 	this.updatePurchaseState(newIngredients);
	// 	this.setState({ingredients: newIngredients, totalPrice: newTotalPrice});
	// }

	purchaseHandler = () => {
		if(this.props.isAuthenticated){
			this.setState({purchasing: true});
		}
		else{
			this.props.onSetAuthRedirectPath('/checkout');
			this.props.history.push('/auth');
		}
	}

	purchaseCancelHandler = () => {
		this.setState({purchasing: false});
	}

	purchaseContinue = () => {
		this.props.onInitPurchase();
		this.props.history.push('/checkout');
	}

	render(){

		let disabledInfo = {...this.props.ings};

		for(let key in disabledInfo){
			disabledInfo[key] = disabledInfo[key] <= 0;
		}



		let orderSummary = null;

		let burger = <Spinner/>

		if(this.props.ings){
			burger = (
				<Aux>
					<Burger ingredients={this.props.ings}/>
					<BuildControls 
						addIngredients={this.props.onIngredientAdded}
						removeIngredients={this.props.onIngredientRemove}
						disabledInfo={disabledInfo}
						totalPrice={this.props.totalPrice}
						purchasable={this.updatePurchaseState(this.props.ings)}
						ordered={this.purchaseHandler}
						isAuth={this.props.isAuthenticated}/>
				</Aux>
			);
				orderSummary = <OrderSummary 
				ingredients={this.props.ings}
				purchaseContinue={this.purchaseContinue}
				modalClosed={this.purchaseCancelHandler}
				price={this.props.totalPrice}/>
		}

		return(
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
					{burger}
			</Aux>
			);
	}
}

const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		totalPrice: state.burgerBuilder.totalPrice,
		isAuthenticated: state.auth.token !== null
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
		onIngredientRemove: (ingName) => dispatch(actions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit()),
		onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));