import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CloudAddPage } from './cloud-add.page';

describe('CloudAddPage', () => {
  let component: CloudAddPage;
  let fixture: ComponentFixture<CloudAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CloudAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
