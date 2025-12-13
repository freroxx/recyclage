import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] shadow-sm hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98] shadow-sm hover:shadow-md",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-[0.98] hover:border-primary/30",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /**
   * Loading state for the button
   */
  loading?: boolean;
  /**
   * Left icon component
   */
  leftIcon?: React.ReactNode;
  /**
   * Right icon component
   */
  rightIcon?: React.ReactNode;
  /**
   * Icon-only button
   */
  icon?: React.ReactNode;
  /**
   * Animation duration in milliseconds
   */
  animationDuration?: number;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    icon,
    children,
    disabled,
    type = "button",
    animationDuration,
    style,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // Determine if this is an icon-only button
    const isIconOnly = (icon !== undefined && !children) || (size === "icon" && !children);
    
    // Combine loading and disabled states
    const isDisabled = disabled || loading;
    
    // Enhanced loading spinner with smooth animation
    const LoadingSpinner = () => (
      <svg 
        className="animate-spin" 
        style={{ 
          animationDuration: animationDuration ? `${animationDuration}ms` : '500ms',
          width: '1em',
          height: '1em',
        }}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
          strokeDasharray="80"
          strokeDashoffset="60"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    // Determine what to render inside the button
    const renderContent = () => {
      if (loading) {
        return (
          <span className="inline-flex items-center justify-center gap-2 animate-pulse">
            <LoadingSpinner />
            {children && <span className="animate-fade-in">{children}</span>}
          </span>
        );
      }

      if (isIconOnly && icon) {
        return (
          <span className="inline-flex items-center justify-center">
            {icon}
          </span>
        );
      }

      return (
        <span className="inline-flex items-center justify-center gap-2 transition-all duration-200">
          {leftIcon && !rightIcon && leftIcon}
          {icon && children && icon}
          {children && <span>{children}</span>}
          {rightIcon && !leftIcon && !icon && rightIcon}
        </span>
      );
    };

    const buttonClassName = cn(
      buttonVariants({ variant, size, className }),
      {
        // Cursor states
        'cursor-not-allowed': isDisabled,
        'cursor-wait': loading,
        // For icon-only buttons, ensure proper padding
        'p-0': isIconOnly && size !== "icon",
        // Hover animation disabled when loading or disabled
        'hover:scale-105 active:scale-[0.98]': !isDisabled && !loading && variant !== 'ghost' && variant !== 'link',
        // Pulse animation for loading
        'animate-pulse-subtle': loading,
      }
    );

    // Don't pass custom props to the underlying element
    const { loading: _, leftIcon: __, rightIcon: ___, icon: ____, animationDuration: _____, ...restProps } = props;

    const buttonStyle = {
      transitionDuration: animationDuration ? `${animationDuration}ms` : '200ms',
      ...style,
    };

    return (
      <Comp
        className={buttonClassName}
        style={buttonStyle}
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        data-loading={loading}
        data-icon-only={isIconOnly}
        {...restProps}
      >
        {renderContent()}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
