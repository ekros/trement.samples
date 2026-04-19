'use client';

import React from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import type { PageBlocksContact, PageBlocksContactFields } from '@/tina/__generated__/types';
import { Section, sectionBlackGlassSchemaField, sectionBlockSchemaField } from '../layout/section';
import { Button } from '../ui/button';
import { useLanguage } from './hooks/useLanguage';
import { parseMultiLingualText } from '@/lib/client-utils';

type FieldType = 'text' | 'textarea' | 'checkbox';

type FieldValue = string | boolean;

const toPayloadKey = (value?: string | null) => {
    const normalized = (value || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

    return normalized || 'field';
};

const getFieldKey = (
    field: PageBlocksContactFields,
    index: number,
) => {
    const keySource = field.name || field.label || `field_${index + 1}`;
    return toPayloadKey(keySource);
};

const getInitialValues = (data: PageBlocksContact) => {
    const next: Record<string, FieldValue> = {};
    data.fields?.forEach((field, index) => {
        if (!field) return;
        const key = getFieldKey(field, index);
        const isCheckbox = field.type === 'checkbox';
        next[key] = isCheckbox ? Boolean(field.checkboxDefault) : '';
    });
    return next;
};

const validateRequiredFields = (data: PageBlocksContact, values: Record<string, FieldValue>) => {
    const missing: string[] = [];
    data.fields?.forEach((field, index) => {
        if (!field || !field.required) return;

        const key = getFieldKey(field, index);
        const value = values[key];

        if (field.type === 'checkbox') {
            if (value !== true) {
                missing.push(field.label || key);
            }
            return;
        }

        if (typeof value !== 'string' || value.trim().length === 0) {
            missing.push(field.label || key);
        }
    });
    return missing;
};

export const Contact = ({ data }: { data: PageBlocksContact }) => {
    const lang = useLanguage();
    const [values, setValues] = React.useState<Record<string, FieldValue>>(() => getInitialValues(data));
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = React.useState(false);

    React.useEffect(() => {
        setValues(getInitialValues(data));
        setSubmitError(null);
        setSubmitSuccess(false);
    }, [data]);

    const handleInputChange = (key: string, value: FieldValue) => {
        setValues((current) => ({ ...current, [key]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const requiredMissing = validateRequiredFields(data, values);
        if (requiredMissing.length > 0) {
            setSubmitSuccess(false);
            setSubmitError(parseMultiLingualText(data.requiredMessage || 'es::Por favor, completa todos los campos obligatorios.;;en::Please complete all required fields.', lang));
            return;
        }

        if (!data.submitUrl) {
            setSubmitSuccess(false);
            setSubmitError(parseMultiLingualText(data.submitErrorMessage || 'es::El endpoint del formulario no está configurado.;;en::Form endpoint is not configured.', lang));
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const payload: Record<string, FieldValue> = {};
            data.fields?.forEach((field, index) => {
                if (!field) return;
                const key = getFieldKey(field, index);
                payload[key] = values[key];
            });

            const response = await fetch(data.submitUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Submit failed with status ${response.status}`);
            }

            setSubmitSuccess(true);
            setSubmitError(null);
            setValues(getInitialValues(data));
        } catch {
            setSubmitSuccess(false);
            setSubmitError(parseMultiLingualText(data.submitErrorMessage || 'es::No se pudo enviar el formulario.;;en::Unable to submit the form.', lang));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Section background={data.background || undefined} isBlackGlass={data.isBlackGlass || undefined}>
            <div className='mx-auto w-full max-w-3xl'>
                {data.title && (
                    <h2 className='text-foreground text-3xl font-semibold' data-tina-field={tinaField(data, 'title')}>
                        {parseMultiLingualText(data.title, lang)}
                    </h2>
                )}

                {data.description && (
                    <p className='text-muted-foreground mt-4' data-tina-field={tinaField(data, 'description')}>
                        {parseMultiLingualText(data.description, lang)}
                    </p>
                )}

                <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
                    {data.fields?.map((field, index) => {
                        if (!field) return null;

                        const key = getFieldKey(field, index);
                        const type = (field.type as FieldType) || 'text';
                        const value = values[key];

                        return (
                            <div key={`${key}_${index}`} className='space-y-2' data-tina-field={tinaField(field)}>
                                <label className='text-sm font-medium block' htmlFor={key} data-tina-field={tinaField(field, 'label')}>
                                    {parseMultiLingualText(field.label, lang)}
                                    {field.required ? ' *' : ''}
                                </label>

                                {type === 'textarea' && (
                                    <textarea
                                        id={key}
                                        name={key}
                                        className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-32 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                                        required={Boolean(field.required)}
                                        value={typeof value === 'string' ? value : ''}
                                        onChange={(event) => handleInputChange(key, event.target.value)}
                                    />
                                )}

                                {type === 'text' && (
                                    <input
                                        id={key}
                                        name={key}
                                        type='text'
                                        className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                                        required={Boolean(field.required)}
                                        value={typeof value === 'string' ? value : ''}
                                        onChange={(event) => handleInputChange(key, event.target.value)}
                                    />
                                )}

                                {type === 'checkbox' && (
                                    <div className='flex items-center gap-3'>
                                        <input
                                            id={key}
                                            name={key}
                                            type='checkbox'
                                            className='h-4 w-4 rounded border-gray-300'
                                            checked={Boolean(value)}
                                            required={Boolean(field.required)}
                                            onChange={(event) => handleInputChange(key, event.target.checked)}
                                        />
                                        <span className='text-sm text-muted-foreground'>
                                            {field.required ? (lang === 'es' ? 'Obligatorio' : 'Required') : (lang === 'es' ? 'Opcional' : 'Optional')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <Button type='submit' disabled={isSubmitting} data-tina-field={tinaField(data, 'submitButtonText')}>
                        {parseMultiLingualText(data.submitButtonText || 'Submit', lang)}
                    </Button>

                    {submitError && (
                        <p className='text-sm text-red-500' data-tina-field={tinaField(data, 'submitErrorMessage')}>
                            {submitError}
                        </p>
                    )}

                    {submitSuccess && (
                        <p className='text-sm text-green-600' data-tina-field={tinaField(data, 'successMessage')}>
                            {parseMultiLingualText(data.successMessage || 'es::Formulario enviado correctamente.;;en::Submitted successfully.', lang)}
                        </p>
                    )}
                </form>
            </div>
        </Section>
    );
};

export const contactBlockSchema: Template = {
    name: 'contact',
    label: 'Contact',
    ui: {
        previewSrc: '/blocks/content.png',
        defaultItem: {
            title: 'Contact',
            description: 'Tell us about your project.',
            submitButtonText: 'Send',
            successMessage: 'Thanks! We will be in touch soon.',
            submitErrorMessage: 'There was an error sending your message.',
            requiredMessage: 'Please complete all required fields.',
            submitUrl: 'https://example.com/contact',
            fields: [
                {
                    name: 'name',
                    label: 'Name',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'message',
                    label: 'Message',
                    type: 'textarea',
                    required: true,
                },
            ],
        },
    },
    fields: [
        sectionBlockSchemaField as any,
        sectionBlackGlassSchemaField as any,
        {
            type: 'string',
            label: 'Title',
            name: 'title',
        },
        {
            type: 'string',
            label: 'Description',
            name: 'description',
            ui: {
                component: 'textarea',
            },
        },
        {
            type: 'string',
            label: 'Submit URL',
            name: 'submitUrl',
            required: true,
            description: 'External endpoint that receives form data as JSON via POST.',
        },
        {
            type: 'string',
            label: 'Submit Button Text',
            name: 'submitButtonText',
            required: true,
        },
        {
            type: 'string',
            label: 'Success Message',
            name: 'successMessage',
            required: true,
        },
        {
            type: 'string',
            label: 'Required Validation Message',
            name: 'requiredMessage',
            required: true,
        },
        {
            type: 'string',
            label: 'Submit Error Message',
            name: 'submitErrorMessage',
            required: true,
        },
        {
            type: 'object',
            list: true,
            label: 'Fields',
            name: 'fields',
            ui: {
                defaultItem: {
                    name: 'field_name',
                    label: 'Field Label',
                    type: 'text',
                    required: false,
                    checkboxDefault: false,
                },
                itemProps: (item) => ({
                    label: item?.label || item?.name || 'Field',
                }),
            },
            fields: [
                {
                    type: 'string',
                    label: 'Field Name (payload key)',
                    name: 'name',
                    required: true,
                },
                {
                    type: 'string',
                    label: 'Label',
                    name: 'label',
                    required: true,
                },
                {
                    type: 'string',
                    label: 'Type',
                    name: 'type',
                    required: true,
                    options: [
                        { label: 'Text', value: 'text' },
                        { label: 'Textarea', value: 'textarea' },
                        { label: 'Checkbox', value: 'checkbox' },
                    ],
                },
                {
                    type: 'boolean',
                    label: 'Required',
                    name: 'required',
                },
                {
                    type: 'boolean',
                    label: 'Checkbox Default Checked',
                    name: 'checkboxDefault',
                },
            ],
        },
    ],
};