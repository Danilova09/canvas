import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('color') color!: ElementRef;
  ws!: WebSocket;



  ngAfterViewInit(): void {
    this.ws = new WebSocket('ws://localhost:8000/draw');
    this.ws.onclose = () => console.log('ws closed!');
  }

  drawPixel(x: number, y: number) {
    const color = this.color.nativeElement;
    const canvas: HTMLCanvasElement = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = color.value;
    ctx.fill();
  }

  onCanvasClick(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
    this.ws.send(JSON.stringify({
      type: 'SEND_PIXEL',
      coordinates: {x, y}
    }))
    this.drawPixel(x, y);
  }

  ngOnDestroy(): void {
    this.ws.close();
  }
}
