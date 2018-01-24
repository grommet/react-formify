import FormState from '../FormState';

import { deepMerge } from '../utils';

test('FormState fails to instantiate without rules', () => {
  expect(() => new FormState()).toThrowError('Rules is a required argument');
  expect(() => new FormState({})).toThrowError('Rules is a required argument');
});

test('FormState instantiate with valid basic rule', () => {
  const formState = new FormState({
    email: 'is required',
  });
  expect(formState).toMatchSnapshot();
  expect(formState.isValid()).toBeFalsy();
  expect(formState.getErrors()).toMatchSnapshot();
});

const emailExpression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

test('FormState validates rules', () => {
  const formState = new FormState((user) => {
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
      kids: (value, index) => {
        if (index >= 0) {
          if (!value[index].name) {
            return { name: 'Name is required' };
          }
        } else if (!value || !value.length) {
          return 'You need to have at least one kid';
        }
        return undefined;
      },
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
  });
  expect(formState).toMatchSnapshot();
  expect(formState.isValid()).toBeFalsy();
  expect(formState.getErrors()).toMatchSnapshot();

  formState.set('email', 'a');

  expect(formState.isValid()).toBeFalsy();
  expect(formState.getErrors()).toMatchSnapshot();

  formState.set('kids', [{ age: 10 }]);

  expect(formState.isValid()).toBeFalsy();
  expect(formState.getErrors()).toMatchSnapshot();

  formState.set('address.home.street', 'street');

  expect(formState.isValid()).toBeFalsy();
  expect(formState.getErrors()).toMatchSnapshot();

  formState.set('email', 'a@test.com');
  formState.set('name', 'name');
  formState.set('size', 'big');
  formState.set('confirm', true);
  formState.set('address.city', 'city');
  formState.set('kids', [{ name: 'paul', age: 10 }]);

  expect(formState.isValid()).toBeTruthy();
  expect(formState.getErrors()).toMatchSnapshot();
  expect(formState.get()).toMatchSnapshot();
});

test('FormState validates empty array', () => {
  const formState = new FormState({
    kids: 'Provide Kids',
  });

  expect(formState.isValid()).toBeFalsy();
  expect(formState.getErrors()).toMatchSnapshot();

  formState.set('kids', []);

  expect(formState.isValid()).toBeFalsy();
  expect(formState.getErrors()).toMatchSnapshot();

  formState.set('kids', ['one kid']);

  expect(formState.isValid()).toBeTruthy();
  expect(formState.getErrors()).toMatchSnapshot();
  expect(formState.get()).toMatchSnapshot();
});

test('FormState validates empty string', () => {
  const formState = new FormState({
    name: 'is required',
  });
  expect(formState.isValid()).toBeFalsy();
  formState.set('name', '   ');
  expect(formState.isValid()).toBeFalsy();
  formState.set('name', '  test ');
  expect(formState.isValid()).toBeTruthy();
  expect(formState.get()).toMatchSnapshot();
  expect(formState.getResource()).toMatchSnapshot();
});
