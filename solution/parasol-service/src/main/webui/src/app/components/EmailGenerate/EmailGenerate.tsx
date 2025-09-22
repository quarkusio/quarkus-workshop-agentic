import config from '@app/config';
import {
  ActionGroup,
  Button,
  Card,
  FileUpload,
  Form,
  FormGroup,
  Page,
  PageSection,
  Text,
  TextArea,
  TextContent,
  TextInput,
  TextVariants
} from '@patternfly/react-core';
import axios from 'axios';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

const EmailGenerate: React.FunctionComponent = () => {
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    emailAddress: '',
    body: '',
    image: null as File | null,
    imageBase64: '' as string
  });

  const [validationErrors, setValidationErrors] = React.useState({
    emailAddress: '',
    body: '',
    image: ''
  });

  const [isFileUploading, setIsFileUploading] = React.useState(false);
  const [filename, setFilename] = React.useState('');

  const handleEmailChange = (event: React.FormEvent<HTMLInputElement>, value: string) => {
    setFormData({
      ...formData,
      emailAddress: value
    });

    if (validationErrors.emailAddress) {
      setValidationErrors({
        ...validationErrors,
        emailAddress: ''
      });
    }
  };

  const handleBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>, value: string) => {
    setFormData({
      ...formData,
      body: value
    });

    if (validationErrors.body) {
      setValidationErrors({
        ...validationErrors,
        body: ''
      });
    }
  };

  const handleFileChange = (file: File, filename: string) => {
    setFormData({
      ...formData,
      image: file
    });
    setFilename(filename);

    if (validationErrors.image) {
      setValidationErrors({
        ...validationErrors,
        image: ''
      });
    }

    // Convert the file to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFormData(prevState => ({
        ...prevState,
        imageBase64: reader.result as string
      }));
    };
  };

  const handleFileRejected = (reason: string) => {
    setValidationErrors({
      ...validationErrors,
      image: reason
    });
  };

  const validateForm = () => {
    const errors = {
      emailAddress: '',
      body: '',
      image: ''
    };
    
    let isValid = true;

    if (!formData.body.trim()) {
      errors.body = 'Message body is required';
      isValid = false;
    }

    if (!formData.emailAddress.trim()) {
      errors.emailAddress = 'Email address is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      errors.emailAddress = 'Email address is invalid';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Create a JSON object to send
    const claimData = {
      emailAddress: formData.emailAddress,
      body: formData.body,
      status: 'New',
      claimNumber: 'AUTO-' + Math.floor(Math.random() * 10000),
      category: 'Single vehicle',
      clientName: formData.emailAddress.split('@')[0], // Use part of email as name
      subject: 'New claim submission',
      policyNumber: 'POL-' + Math.floor(Math.random() * 10000),
      originalImages: formData.imageBase64 ? JSON.stringify([{
        image_name: filename || 'Uploaded Image',
        image_key: formData.imageBase64,
        claim_id: 'new'
      }]) : null,
    };

    axios.post(config.backend_api_url + '/db/claims', claimData)
      .then(response => {
        setIsSubmitting(false);
        // Redirect to the claims list page after successful submission
        history.push('/ClaimsList');
      })
      .catch(error => {
        setIsSubmitting(false);
        console.error('Error submitting claim:', error);
        // You could add error handling UI here
      });
  };

  return (
    <Page>
      <PageSection>
        <TextContent>
          <Text component={TextVariants.h1}>Generate Email</Text>
          <Text component={TextVariants.p}>
            Use this form to generate a new email for claim submission.
          </Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <Card>
          <Form onSubmit={handleSubmit}>
            <FormGroup 
              label="Email Address" 
              isRequired 
              fieldId="emailAddress"
            >
              <TextInput
                isRequired
                type="email"
                id="emailAddress"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleEmailChange}
                validated={validationErrors.emailAddress ? "error" : "default"}
              />
              {validationErrors.emailAddress && (
                <div style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>
                  {validationErrors.emailAddress}
                </div>
              )}
            </FormGroup>

            <FormGroup 
              label="Message Body" 
              isRequired 
              fieldId="body"
            >
              <TextArea
                isRequired
                id="body"
                name="body"
                value={formData.body}
                onChange={handleBodyChange}
                validated={validationErrors.body ? "error" : "default"}
                resizeOrientation="vertical"
                style={{ height: '200px' }}
              />
              {validationErrors.body && (
                <div style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>
                  {validationErrors.body}
                </div>
              )}
            </FormGroup>

            <FormGroup
              label="Upload Image"
              fieldId="image-upload"
            >
              <FileUpload
                id="image-upload"
                type="text"
                filename={filename}
                filenamePlaceholder="Drag and drop a file or upload one"
                isLoading={isFileUploading}
                onFileInputChange={(_, file) => handleFileChange(file, file.name)}
                onReadStarted={() => setIsFileUploading(true)}
                onReadFinished={() => setIsFileUploading(false)}
                onClearClick={() => {
                  setFormData({...formData, image: null});
                  setFilename('');
                }}
                allowEditingUploadedText={false}
                browseButtonText="Upload"
                onTextChange={() => {}}
                validated={validationErrors.image ? "error" : "default"}
              />
              {validationErrors.image && (
                <div style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>
                  {validationErrors.image}
                </div>
              )}
            </FormGroup>

            <ActionGroup>
              <Button 
                variant="primary" 
                type="submit" 
                isDisabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => history.push('/ClaimsList')}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
            </ActionGroup>
          </Form>
        </Card>
      </PageSection>
    </Page>
  );
};

export { EmailGenerate };
