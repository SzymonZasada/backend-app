export default interface UserInterface {
    email: string;
    password: string;
    userId: string;
    refreshToken?: string | null;
}