import React, { useRef, useCallback } from 'react';
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
  Container, Title, BackToSignIn, BackToSignInText,
} from './styles';
import getValidationErrors from '../../ultils/getValidationErrors';
import api from '../../services/api';

interface SignUpDTO {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const passwordRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);

  const handleSubmit = useCallback(
    async (data: SignUpDTO) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome Obrigatório'),
          email: Yup.string()
            .required('Email Obrigatório')
            .email('Formato de Email inválido'),
          password: Yup.string().min(
            6,
            'A senha deve conter no mínimo 6 characteres',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('users', data);

        Alert.alert('Sucesso!', 'Agora você já pode Logar na plataforma');

        navigation.goBack();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert('Opss..', 'Erro ao cadastrar, tente novamente!');
      }
    },
    [navigation],
  );

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
              <Title>Crie Sua Conta</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSubmit}>
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />
              <Input
                ref={emailRef}
                name="email"
                icon="mail"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              <Input
                ref={passwordRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
              <Button onPress={() => formRef.current?.submitForm()}>
                Cadastrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>Voltar para Logon</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default SignUp;
