import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { usePOS } from '../../context/POSContext';
import { Delete, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { User } from '../../types';

export function LoginPage() {
    const navigate = useNavigate();
    const { users, currentUser, setCurrentUser, login } = usePOS();

    const [pin, setPin] = useState<string>('');
    const [error, setError] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Local state for the selected user to login as (defaults to first user if currentUser is null)
    const selectedUser = currentUser || users[0];

    const handleKeyPress = (num: string) => {
        if (pin.length < 4) {
            setPin(prev => prev + num);
            setError(false);
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
        setError(false);
    };

    const handleLogin = () => {
        // If not matching 4 digits yet, do nothing
        if (pin.length < 4) return;

        // We first select the user using context to make sure state is right
        setCurrentUser(selectedUser);

        const success = login(pin);
        if (success) {
            navigate('/');
        } else {
            setError(true);
            setPin('');
        }
    };

    const handleUserSelect = (user: User) => {
        setCurrentUser(user);
        setIsDropdownOpen(false);
        setPin('');
        setError(false);
    };

    return (
        <div className={styles.container}>
            {/* Left side: Hero Image */}
            <div className={styles.heroSection}>
                {/* USER: Replace the src below with your actual background image location */}
                <img
                    src="/Assets image & logo/Login Image.png"
                    alt="Coffee Shop Background"
                    className={styles.heroImage}
                />
            </div>

            {/* Right side: Login Panel */}
            <div className={styles.loginSection}>
                <div className={styles.loginContent}>
                    <div className={styles.headerTitles}>
                        <span className={styles.welcomeText}>Welcome AGAIN__</span>
                        <h1 className={styles.title}>Cashier Login</h1>
                    </div>

                    <div className={styles.roleSelector}>
                        <span className={styles.roleLabel}>Cashier</span>
                        <div
                            className={styles.dropdownTrigger}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <div className={styles.userInfo}>
                                <div className={styles.avatar}>🧑‍💼</div>
                                <div className={styles.userDetails}>
                                    <span className={styles.userName}>{selectedUser.name}</span>
                                    <span className={styles.userShift}>{selectedUser.shift}</span>
                                </div>
                            </div>
                            <ChevronDown size={20} className={styles.dropdownIcon} />
                        </div>

                        {isDropdownOpen && (
                            <div className={styles.dropdownMenu}>
                                {users.map(u => (
                                    <div
                                        key={u.id}
                                        className={styles.dropdownItem}
                                        onClick={() => handleUserSelect(u)}
                                    >
                                        <div className={styles.avatar}>🧑‍💼</div>
                                        <div className={styles.userDetails}>
                                            <span className={styles.userName}>{u.name}</span>
                                            <span className={styles.userShift}>{u.shift}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.pinSection}>
                        <span className={styles.pinInstruction}>Please Input your account pin to login</span>

                        <div className={cn(styles.pinDots, error && styles.pinErrorAnimation)}>
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        styles.pinSlot,
                                        i < pin.length && styles.pinSlotFilled,
                                        error && styles.pinSlotError
                                    )}
                                >
                                    {i < pin.length ? '•' : ''}
                                </div>
                            ))}
                        </div>

                        {error && <span className={styles.errorText}>Invalid PIN. Please try again.</span>}

                        <div className={styles.numpad}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <button
                                    key={num}
                                    className={styles.numBtn}
                                    onClick={() => handleKeyPress(num.toString())}
                                >
                                    {num}
                                </button>
                            ))}
                            <div className={styles.numEmpty}></div>
                            <button className={styles.numBtn} onClick={() => handleKeyPress('0')}>0</button>
                            <button className={styles.numBtn} onClick={handleDelete}>
                                <Delete size={24} />
                            </button>
                        </div>
                    </div>

                    <button
                        className={cn(styles.loginBtn, pin.length === 4 && styles.loginBtnActive)}
                        onClick={handleLogin}
                        disabled={pin.length < 4}
                    >
                        Log in
                    </button>
                </div>
            </div>
        </div>
    );
}
