import { UserRepository } from '../../domain/repositories/UserRepository';
import { Signup } from '../../domain/usecases/auth/Signup';
import { Login } from '../../domain/usecases/auth/Login';
import { GetUserById } from '../../domain/usecases/auth/GetUserById';
import { SignupDTO, LoginDTO, UserResponseDTO } from '../dataTransferObjects/UserDTO';

export class AuthService {
  private signupUseCase: Signup;
  private loginUseCase: Login;
  private getUserByIdUseCase: GetUserById;

  constructor(userRepository: UserRepository) {
    this.signupUseCase = new Signup(userRepository);
    this.loginUseCase = new Login(userRepository);
    this.getUserByIdUseCase = new GetUserById(userRepository);
  }

  async signup(dto: SignupDTO): Promise<UserResponseDTO> {
    const user = await this.signupUseCase.execute(dto.name, dto.email, dto.password, dto.role);
    return this.toDTO(user);
  }

  async login(dto: LoginDTO): Promise<{ user: UserResponseDTO; token: string }> {
    const { user, token } = await this.loginUseCase.execute(dto.email, dto.password);
    return { user: this.toDTO(user), token };
  }

  async getUserById(userId: string): Promise<UserResponseDTO> {
    const user = await this.getUserByIdUseCase.execute(userId);
    return this.toDTO(user);
  }

  private toDTO(user: any): UserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }
}