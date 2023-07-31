import { TextInputProps } from '@mantine/core';
import { UseFormMethods } from 'react-hook-form';

export interface IInput extends TextInputProps {
  /**
   * Input reference for register meta lib dependency 'react-hook-form'
   */
  registerMeta?: object;

  /**
   * reference to 'react-hook-form'
   */
  useformRef?: UseFormMethods;
}
