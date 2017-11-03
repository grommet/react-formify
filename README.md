[![Slack](http://alansouzati.github.io/artic/img/slack-badge.svg)](http://slackin.grommet.io)  [![Build Status](https://travis-ci.org/grommet/grommet-form.svg?branch=master)](https://travis-ci.org/grommet/grommet-form) [![Test Coverage](https://codeclimate.com/github/grommet/grommet-form/badges/coverage.svg)](https://codeclimate.com/github/grommet/grommet-form/coverage)  [![Dependency Status](https://david-dm.org/grommet/grommet-form.svg)](https://david-dm.org/grommet/grommet-form) [![devDependency Status](https://david-dm.org/grommet/grommet-form/dev-status.svg)](https://david-dm.org/grommet/grommet-form#info=devDependencies)

# grommet-form

An uncontrolled react Form component with validation capabilities.

## Install

`npm install grommet-form`

or 

`yarn add grommet-form`

## Usage

```javascript
import React from 'react';
import Form from 'grommet-form';

const emailExpression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const rules = {
  email: (value) => {
    if (!value || value === '') {
      return 'Email is required';
    } else if (!emailExpression.test(value)) {
      return 'Email is not valid';
    }
    return undefined;
  },
  name: 'Name is required',
};

const UserForm = () => (
  <Form
    defaultErrors={{ email: 'This is an existing email' }}
    defaultValue={{ email: 'alan@gmail.com' }}
    onSubmit={user => alert(JSON.stringify(user, null, 2))}
    rules={rules}
  >
    {(state, errors) => (
      <fieldset>
        <input {...state.name} />
        {errors.name ? <span className="error">{errors.name}</span> : undefined}
        <input {...state.email} />
        <input {...state.get('optional.field')} />
        {errors.email ? <span className="error">{errors.email}</span> : undefined}
        <button type='submit'>Add</button>
      </fieldset>
    )}
  </Form>
);
```

* **NOTE**: :warning: it is the caller responsibility to add some control to submit the form. In this example we are adding a submit button.

## Try

[![](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rlyxzpql9o)

## Form Props (API)

### **children**

Required. A function that will be invoked with state and errors. State is an object that you can
get the form properties per key defined in rules. For example, these rules:

```javascript
const rules = {
  email: (value) => {
    if (!value || value === '') {
      return 'Email is required';
    } else if (!emailExpression.test(value)) {
      return 'Email is not valid';
    }
    return undefined;
  },
  name: 'Name is required',
};
```

will generate the following state:

```
{
  email: {
    name: 'email',
    value: 'alan@gmail.com',
    onChange: (event) => { ... },
  },
  name: {
    name: 'name',
    value: '',
    onChange: (event) => { ... },
  }
}
```

This approach of holding the values in a raw object allows you to use any form element you want. You can use `<input />` from React, or `<TextInput />` from Grommet. All you need to do is to make sure to call `{...state.name}` where name is the property you want to assign to a given form element.

* **errors** object will hold the errors in a given form element. The errors will be present if you passed some `defaultErrors` or when the form is submitted.

You can call `state.get('optional')` to get the form properties object for fields that do not have any validation criteria. Similarly, you can call `errors.get('address.street.home')` to get the error of a given nested property in the object, returning undefined otherwise.

### **defaultErrors**

An object with default errors to show when the form is rendered.

### **defaultValue**

An object with default values to show when the form is rendered.

### **onSubmit**

Required. A function that will be invoked when the form is submitted and **valid**.
The object (resource) is passed as the first argument to the function.

### **rules**

An object or function that will validate the form based on predefined rules. If `rules` is a function, it will be invoked when validation is needed. The function passes the resource as the argument so that the caller can decide which set of rules to return. This can be useful when you want a completely different set of rules depending on a given selection in the form, for example:

```javascript
const userRules = (user) => {
  const defaultValidation = {
    email: (value) => {
      if (!value || value === '') {
        return 'Email is required';
      } else if (!emailExpression.test(value)) {
        return 'Email is not valid';
      }
      return undefined;
    },
    name: 'Name is required',
    size: 'Size is required',
    confirm: 'Please confirm answers',
    address: {
      home: {
        street: 'Street is required',
      },
    },
  };
  if (
    user.address &&
    user.address.home &&
    user.address.home.street &&
    user.address.home.street !== ''
  ) {
    return deepMerge(defaultValidation, {
      address: {
        city: 'City is required if you provided street',
      },
    });
  }
  return defaultValidation;
};
```

In this example, `city` will be required if `street` name is provided.

## Build 

To build this library, execute the following commands:

  1. Install NPM modules

    $ npm install (or yarn install)

  2. Run pack

    $ npm run dist

  3. Test and run linters:

    $ npm run check
