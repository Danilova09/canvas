import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

interface Pixel {
  x: number,
  y: number,
  color: string,
}

interface ServerMessage {
  type: string,
  coordinates: Pixel[],
  pixelCoordinates: Pixel
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('colorInput') colorInput!: ElementRef;
  color: string = '#000';
  ws!: WebSocket;

  ngAfterViewInit(): void {
    this.ws = new WebSocket('ws://localhost:8000/draw');
    this.ws.onclose = () => console.log('ws closed!');

    this.ws.onmessage = event => {
      const decodedMessage: ServerMessage = JSON.parse(event.data);

      if (decodedMessage.type === 'PREV_PIXELS') {
        decodedMessage.coordinates.forEach(c => {
          this.drawPixel(c.x, c.y, c.color);
        });
      }

      if (decodedMessage.type === 'NEW_PIXEL') {
        const {x, y, color} = decodedMessage.pixelCoordinates;
        this.drawPixel(x, y, color);
      }
    };
  }

  drawPixel(x: number, y: number, color: string) {
    const canvas: HTMLCanvasElement = this.canvas.nativeElement;
    this.color = this.colorInput.nativeElement.value;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.arc(x - 5, y - 5, 10, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  onCanvasClick(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
    this.ws.send(JSON.stringify({
      type: 'SEND_PIXEL',
      coordinates: {x, y, color: this.color},
    }));
  }

  ngOnDestroy(): void {
    this.ws.close();
  }
}
