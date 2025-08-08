import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('ErrorBoundary', error, info); }
  render() {
    if (this.state.hasError) {
      return <div className="min-h-screen flex items-center justify-center text-white">Something went wrong.</div>;
    }
    return this.props.children;
  }
}