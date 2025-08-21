import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple, FaTwitter } from "react-icons/fa";

interface AuthPageProps {
	mode: "signin" | "signup";
}

export function AuthPage({ mode }: AuthPageProps) {
	const [isSignIn, setIsSignIn] = useState(mode === "signin");
	const [method, setMethod] = useState<'email' | 'phone'>('email');
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [phone, setPhone] = useState("");
	const [otp, setOtp] = useState("");
	const [otpSent, setOtpSent] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleEmailAuth = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setTimeout(() => setIsLoading(false), 1000);
	};

	const handlePhoneAuth = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setTimeout(() => setIsLoading(false), 1000);
	};

	const handleSendOtp = () => {
		setIsLoading(true);
		setTimeout(() => { setOtpSent(true); setIsLoading(false); }, 1000);
	};

		const handleSocialAuth = (provider: string) => {
			if (provider === "google") {
				window.location.href = "/api/login/google";
			} else {
				window.location.href = `/api/auth/${provider}`;
			}
		};

	const toggleMode = () => {
		setIsSignIn((prev) => !prev);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-surface to-primary/5 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<div className="h-24 mx-auto mb-4 flex items-center justify-center">
						<img src="/src/assets/favicon.png" alt="CashReap Logo" className="w-16 h-16 mb-4" />
					</div>
					<h1 className="text-2xl font-bold text-on-surface">Welcome to CashReap</h1>
					<p className="text-sm text-on-surface-variant">Harvest Your Rewards</p>
				</div>
				<Card>
					<CardHeader className="text-center">
						<CardTitle>{isSignIn ? "Sign In" : "Create Account"}</CardTitle>
						<CardDescription>
							{isSignIn 
								? "Welcome back! Sign in to your account" 
								: "Join thousands of users maximizing their credit card rewards"
							}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex gap-2 mb-4">
							<Button variant={method === 'email' ? 'default' : 'outline'} onClick={() => setMethod('email')}>Email</Button>
							<Button variant={method === 'phone' ? 'default' : 'outline'} onClick={() => setMethod('phone')}>Phone</Button>
						</div>
						{method === 'email' && (
							<form onSubmit={handleEmailAuth} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="your@email.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<div className="relative">
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											placeholder="Enter your password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4 text-on-surface-variant" />
											) : (
												<Eye className="h-4 w-4 text-on-surface-variant" />
											)}
										</Button>
									</div>
								</div>
								{!isSignIn && (
									<div className="space-y-2">
										<Label htmlFor="confirmPassword">Confirm Password</Label>
										<div className="relative">
											<Input
												id="confirmPassword"
												type={showConfirmPassword ? "text" : "password"}
												placeholder="Confirm your password"
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												required
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={() => setShowConfirmPassword(!showConfirmPassword)}
											>
												{showConfirmPassword ? (
													<EyeOff className="h-4 w-4 text-on-surface-variant" />
												) : (
													<Eye className="h-4 w-4 text-on-surface-variant" />
												)}
											</Button>
										</div>
									</div>
								)}
								<Button 
									type="submit" 
									className="w-full bg-primary hover:bg-primary/90 text-white"
									disabled={isLoading}
								>
									{isLoading ? "Please wait..." : (isSignIn ? "Sign In" : "Create Account")}
								</Button>
							</form>
						)}
						{method === 'phone' && (
							<form onSubmit={otpSent ? handlePhoneAuth : (e) => { e.preventDefault(); handleSendOtp(); }} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="phone">Phone Number</Label>
									<Input
										id="phone"
										type="tel"
										placeholder="(555) 123-4567"
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
									/>
								</div>
								{otpSent && (
									<div className="space-y-2">
										<Label htmlFor="otp">OTP</Label>
										<Input
											id="otp"
											type="text"
											placeholder="Enter OTP"
											value={otp}
											onChange={(e) => setOtp(e.target.value)}
										/>
									</div>
								)}
								<Button 
									type="submit" 
									className="w-full bg-primary hover:bg-primary/90 text-white"
									disabled={isLoading}
								>
									{isLoading ? "Please wait..." : (otpSent ? (isSignIn ? "Sign In" : "Create Account") : "Send OTP")}
								</Button>
							</form>
						)}
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<Separator className="w-full" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-2 text-on-surface-variant">Or continue with</span>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-2">
							<Button variant="outline" onClick={() => handleSocialAuth("google")} className="w-full">
								<FcGoogle className="w-4 h-4 mr-2" />
								Google
							</Button>
							<Button variant="outline" onClick={() => handleSocialAuth("facebook")} className="w-full">
								<FaFacebookF className="w-4 h-4 mr-2 text-blue-600" />
								Facebook
							</Button>
						</div>
						<div className="grid grid-cols-2 gap-2">
							<Button variant="outline" onClick={() => handleSocialAuth("apple")} className="w-full">
								<FaApple className="w-4 h-4 mr-2 text-black" />
								Apple
							</Button>
							<Button variant="outline" onClick={() => handleSocialAuth("twitter")} className="w-full">
								<FaTwitter className="w-4 h-4 mr-2 text-blue-400" />
								Twitter
							</Button>
						</div>
						<div className="text-center text-sm">
							<span className="text-on-surface-variant">
								{isSignIn ? "New to CashReap?" : "Already have an account?"} {" "}
							</span>
							<Button variant="link" onClick={toggleMode} className="p-0 h-auto font-semibold text-primary">
								{isSignIn ? "Sign Up" : "Sign In"}
							</Button>
						</div>
					</CardContent>
				</Card>
				<div className="text-center mt-6 text-xs text-on-surface-variant">
					<p>Secure authentication • Your data is protected</p>
				</div>
			</div>
		</div>
	);
}

export function SignIn() {
	return <AuthPage mode="signin" />;
}

export function SignUp() {
	return <AuthPage mode="signup" />;
}
