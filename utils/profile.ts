import * as Yup from 'yup';
import { ProfileFormValues, Sport, User } from '../interfaces';
import { formatPhoneNumber, removeNonDigits } from './misc';

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
    city: input.city.trim(),
    homePhone: formatPhoneNumber(input.homePhone) || '',
    cellPhone: formatPhoneNumber(input.cellPhone) || '',
    workPhone: {
      number: formatPhoneNumber(input.workPhone.number) || '',
      extension: input.workPhone.extension.trim(),
    },
    email: input.email.toLowerCase().trim(),
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
    city: input.city.trim(),
    homePhone: removeNonDigits(input.homePhone),
    cellPhone: removeNonDigits(input.cellPhone),
    workPhone: {
      number: removeNonDigits(input.workPhone.number),
      extension: input.workPhone.extension.trim(),
    },
    email: input.email.toLowerCase().trim(),
    sports,
  };
}

export const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  city: Yup.string().required('Your city is required'),
  homePhone: Yup.string()
    .transform(value => {
      return removeNonDigits(value);
    })
    .matches(new RegExp(/^\d{10}$/), 'Must be a valid 10 digit number'),
  cellPhone: Yup.string()
    .transform(value => {
      return removeNonDigits(value);
    })
    .matches(new RegExp(/^\d{10}$/), 'Must be a valid 10 digit number'),
  workPhone: Yup.object().shape({
    number: Yup.string()
      .transform(value => {
        return removeNonDigits(value);
      })
      .matches(new RegExp(/^\d{10}$/), 'Must be a valid 10 digit number'),
  }),
  email: Yup.string()
    .email('A valid email is required')
    .required('Email is required'),
});
