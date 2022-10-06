import * as Yup from 'yup';
import { ProfileFormValues, Sport, User } from '../interfaces';
import { formatPhoneNumber, formatZipcode, removeNonDigits } from './misc';

export const blankProfileFormValues: ProfileFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: {
    street: '',
    street2: '',
    city: '',
    state: '',
    zipcode: '',
  },
  sports: [],
  isAdmin: false, // set again on server so they can't override
  createdAt: '', // set on the server
  updatedAt: '', // set on the server
};

export function formatDbValuesForForm(input: User): ProfileFormValues {
  const { _id, ...user } = input;
  const sports: Sport[] = [
    'Baseball',
    'Basketball',
    'Football',
    'Softball',
    'Volleyball',
  ];
  const updatedSports = sports.map(sport => {
    const officiatesSport = input.sports.find(s => s.name === sport);
    if (officiatesSport) {
      return officiatesSport;
    } else {
      return {
        name: sport,
        level: 'NAO' as const,
      };
    }
  });

  return {
    ...user,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.toLowerCase().trim(),
    phone: formatPhoneNumber(input.phone) || '',
    address: {
      street: input.address.street.trim(),
      street2: input.address.street2.trim(),
      city: input.address.city.trim(),
      state: input.address.state.trim(),
      zipcode: input.address.zipcode.trim(),
    },
    sports: updatedSports,
  };
}

export function formatFormValuesForDb(
  input: ProfileFormValues
): ProfileFormValues {
  const sports = input.sports.filter(
    s => s.level !== 'NAO' && s.level !== 'default'
  );

  return {
    ...input,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.toLowerCase().trim(),
    phone: removeNonDigits(input.phone),
    address: {
      street: input.address.street.trim(),
      street2: input.address.street2.trim(),
      city: input.address.city.trim(),
      state: input.address.state.trim(),
      zipcode: formatZipcode(input.address.zipcode),
    },
    sports,
  };
}

export const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('A valid email is required')
    .required('Email is required'),
  phone: Yup.string()
    .transform(value => {
      return removeNonDigits(value);
    })
    .matches(new RegExp(/^\d{10}$/), 'Must be a valid 10 digit number'),
  address: Yup.object().shape({
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipcode: Yup.string().required('Zipcode is required'),
  }),
});
