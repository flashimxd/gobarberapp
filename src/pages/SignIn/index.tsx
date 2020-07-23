import React, { useCallback, useRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import logo from '../../assets/logo.png';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';
import getValidationErrors from '../../ultils/getValidationErrors';
import { useAuth } from '../../hooks/auth';

interface SignInDTO {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const { signIn } = useAuth();

  const handleSubmit = useCallback(async (data: SignInDTO) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('Email Obrigatório')
          .email('Formato de Email inválido'),
        password: Yup.string().required('A senha e obrigatória'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await signIn({ email: data.email, password: data.password });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);

        return;
      }

      Alert.alert('Opss..', 'Email ou senha incorretos');
    }
  }, [signIn]);

  return (
    <>
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={logo} />
            <View>
              <Title>Faça seu Logon</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSubmit}>
              <Input
                name="email"
                icon="mail"
                placeholder="E-mail"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
              <Button onPress={() => formRef.current?.submitForm()}>
                Entrar
              </Button>
            </Form>

            <ForgotPassword onPress={() => navigation.navigate('signUp')}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
};

export default SignIn;
