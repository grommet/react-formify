import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Form from '../Form';

Enzyme.configure({ adapter: new Adapter() });

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
  address: {
    street: 'Street is required',
  },
};

test('Form renders', () => {
  const onSubmit = jest.fn();
  const defaultProps = {
    defaultErrors: { email: 'This is an existing email' },
    defaultValue: { email: 'alan@gmail.com' },
    onSubmit,
    rules,
  };
  const component = mount(
    <Form {...defaultProps}>
      {(state, errors) => (
        <fieldset>
          <input {...state.name} />
          {errors.name ? <span className='error'>{errors.get('name')}</span> : undefined}
          <input {...state.email} />
          {errors.email ? <span className='error'>{errors.email}</span> : undefined}
          <input {...state.get('address.street')} />
          {errors.get('address.street') ? (
            <span className='error'>{errors.address.street}</span>
          ) : undefined}
          <input {...state.get('optional.field')} />
          <button type='submit'>Add</button>
          <button
            type='button'
            onClick={() => {
              state.set('name', 'test_default');
              state.set({
                email: 'test@default.com',
              });
            }}
          >
            Set Default
          </button>
        </fieldset>
      )}
    </Form>
  );

  expect(component.getDOMNode()).toMatchSnapshot();

  component.find('input').forEach(node => node.simulate('change', { target: { value: '' } }));

  component.find("button[type='submit']").simulate('submit');

  expect(component.getDOMNode()).toMatchSnapshot();

  component.setProps({ defaultErrors: { name: 'This is a name error' } });

  expect(component.getDOMNode()).toMatchSnapshot();

  component.setProps(
    { rules: () => ({ name: 'just name is required' }), defaultErrors: undefined }
  );
  component.find("button[type='submit']").simulate('submit');

  expect(component.getDOMNode()).toMatchSnapshot();

  component.setProps({ defaultValue: { name: 'default name' } });

  expect(component.getDOMNode()).toMatchSnapshot();

  component.setProps(defaultProps);

  expect(component.getDOMNode()).toMatchSnapshot();

  component.find('input').forEach((node, index) => {
    if (index === 1) {
      node.simulate('change', { target: { value: 'test@gmail.com' } });
    } else {
      node.simulate('change', { target: { value: 'test' } });
    }
  });

  component.find("button[type='submit']").simulate('submit');
  expect(component.getDOMNode()).toMatchSnapshot();
  expect(onSubmit).toBeCalledWith(
    {
      address: { street: 'test' },
      email: 'test@gmail.com',
      name: 'test',
      optional: { field: 'test' } },
  );

  component.find("button[type='button']").simulate('click');
  component.find("button[type='submit']").simulate('submit');
  expect(component.getDOMNode()).toMatchSnapshot();
  expect(onSubmit).toBeCalledWith(
    {
      address: { street: 'test' },
      email: 'test@default.com',
      name: 'test_default',
      optional: { field: 'test' } },
  );
});
