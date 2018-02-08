import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FormState from './FormState';

import { getValueByKey, isObject } from './utils';

export default class Form extends Component {
  static defaultProps = {
    defaultErrors: undefined,
    defaultValue: undefined,
    onError: undefined,
    onChange: undefined,
    reset: undefined,
  }
  static propTypes = {
    children: PropTypes.func.isRequired,
    defaultErrors: PropTypes.object,
    defaultValue: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onError: PropTypes.func,
    onChange: PropTypes.func,
    reset: PropTypes.bool,
    rules: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  }
  constructor(props, context) {
    super(props, context);

    const formState = new FormState(props.rules, props.defaultValue, this.onChange);

    this.state = {
      formState,
      resource: formState.get(),
      errors: props.defaultErrors,
      rules: props.rules,
      isFormSubmitted: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.reset ||
      JSON.stringify(nextProps.rules) !== JSON.stringify(this.props.rules) ||
      JSON.stringify(nextProps.defaultErrors) !== JSON.stringify(this.props.defaultErrors) ||
      JSON.stringify(nextProps.defaultValue) !== JSON.stringify(this.props.defaultValue)
    ) {
      this.reset(nextProps);
    }
  }
  reset(props) {
    const formState = new FormState(props.rules, props.defaultValue, this.onChange);

    this.setState({
      formState,
      resource: formState.get(),
      errors: props.defaultErrors,
      rules: props.rules,
    });
  }
  onChange = (updated) => {
    const { isFormSubmitted, formState } = this.state;
    if (isFormSubmitted) {
      this.setState({ resource: formState.get(), errors: formState.getErrors() });
    } else {
      this.setState({ resource: formState.get(), errors: undefined });
    }
    if (this.props.onChange) {
      this.props.onChange(updated);
    }
  }
  onSubmit = (event) => {
    const { onSubmit, onError } = this.props;
    const { formState } = this.state;
    event.preventDefault();
    if (formState.isValid()) {
      onSubmit(formState.getResource(), () => this.reset(this.props));
    } else {
      const errors = formState.getErrors();
      if (typeof onError === 'function') {
        onError(errors);
      }
      this.setState({ isFormSubmitted: true, errors });
    }
  }
  getStateValue = (key) => {
    const { formState, resource } = this.state;
    return {
      name: key,
      value: getValueByKey(resource, key) || '',
      checked: getValueByKey(resource, key) === true,
      onChange: (event) => {
        let value = typeof event === 'string' ? event : event.option;
        if (!value && event.target) {
          value = event.target.value;
          if (event.target && (event.target.value === '' || event.target.value === 'true')) {
            value = event.target.checked;
          }
        }
        formState.set(key, typeof value === 'undefined' ? '' : value);
      },
    };
  }
  setStateValue = (key, value) => {
    const { formState } = this.state;
    formState.set(key, value);
  }
  getObjectStateValue = (obj, parentKey) => {
    const objStateValue = {};
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'string' || typeof obj[key] === 'function') {
        objStateValue[key] = this.getStateValue(parentKey ? `${parentKey}.${key}` : key);
      } else if (isObject(obj[key])) {
        objStateValue[key] = this.getObjectStateValue(
          obj[key], parentKey ? `${parentKey}.${key}` : key
        );
      }
    });
    return objStateValue;
  }
  render() {
    const { children } = this.props;
    const { errors = {}, formState, resource, rules } = this.state;
    const state = this.getObjectStateValue(typeof rules === 'function' ? rules(resource) : rules);
    state.get = key => this.getStateValue(key);
    state.set = (key, value) => this.setStateValue(key, value);
    errors.get = key => getValueByKey(errors, key);
    return (
      <form onSubmit={this.onSubmit}>
        {children(state, errors, formState.isValid())}
      </form>
    );
  }
}
