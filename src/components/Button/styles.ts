import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton)`
  width: 100%;
  height: 60px;
  border-radius: 10px;
  background: #ff9000;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
`;

export const ButtonText = styled.Text`
  flex: 1;
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #312e38;
`;
