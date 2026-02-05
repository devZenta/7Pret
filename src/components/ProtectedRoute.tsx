import { Navigate } from "react-router-dom";
import { useSession } from "../lib/auth-client";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const { data: session, isPending } = useSession();

	if (isPending) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "calc(100vh - 80px)",
					color: "#5d4037",
				}}
			>
				Chargement...
			</div>
		);
	}

	if (!session) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
