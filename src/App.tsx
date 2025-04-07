import React from 'react';
import './App.scss';

interface State {
  rightClick: boolean;
  time: string;
  clockName: string;
}

export class App extends React.Component<{}, State> {
  private timeIntervalId: number | null = null;

  private nameIntervalId: number | null = null;

  private lastLoggedTime: string = '';

  state: State = {
    rightClick: false,
    time: new Date().toUTCString().slice(-12, -4),
    clockName: 'Clock-0',
  };

  getRandomName(): string {
    const value = Date.now().toString().slice(-4);

    return `Clock-${value}`;
  }

  updateTime = () => {
    const newTime = new Date().toUTCString().slice(-12, -4);

    if (newTime !== this.state.time) {
      this.setState({ time: newTime });
      if (newTime !== this.lastLoggedTime) {
        // eslint-disable-next-line no-console
        console.log(newTime);
        this.lastLoggedTime = newTime;
      }
    }
  };

  updateClockName = () => {
    const newClockName = this.getRandomName();

    this.setState(prevState => {
      // eslint-disable-next-line no-console
      console.warn(`Renamed from ${prevState.clockName} to ${newClockName}`);

      return { clockName: newClockName };
    });
  };

  startIntervals = () => {
    this.timeIntervalId = window.setInterval(this.updateTime, 1000);
    this.nameIntervalId = window.setInterval(this.updateClockName, 3300);
    this.updateTime(); // Ensure immediate time update
  };

  clearIntervals = () => {
    if (this.timeIntervalId) {
      clearInterval(this.timeIntervalId);
    }

    if (this.nameIntervalId) {
      clearInterval(this.nameIntervalId);
    }
  };

  handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    this.setState({ rightClick: true });
    this.clearIntervals();
  };

  handleClick = (event: MouseEvent) => {
    event.preventDefault();
    this.setState({ rightClick: false }, this.startIntervals);
  };

  componentDidMount() {
    document.addEventListener('contextmenu', this.handleContextMenu);
    document.addEventListener('click', this.handleClick);
    this.startIntervals();
  }

  componentWillUnmount() {
    document.removeEventListener('contextmenu', this.handleContextMenu);
    document.removeEventListener('click', this.handleClick);
    this.clearIntervals();
  }

  render() {
    return (
      <div className="App">
        <h1>React clock</h1>
        {!this.state.rightClick && (
          <div className="Clock">
            <strong className="Clock__name">{this.state.clockName}</strong>
            {' time is '}
            <span className="Clock__time">{this.state.time}</span>
          </div>
        )}
      </div>
    );
  }
}
