import {
    Component, OnInit, Input, animate, transition, style, state,
    trigger, AfterViewChecked, OnDestroy, ViewChild
} from '@angular/core';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../../style/app.css';
import { DEFAULT_STYLES } from './form-renderer.component.css';
import { DataSources } from '../data-sources/data-sources';
import { NodeBase } from '../form-factory/form-node';
import { AfeFormGroup } from '../../abstract-controls-extension/afe-form-group';
import { ValidationFactory } from '../form-factory/validation.factory';
import { DataSource } from '../question-models/interfaces/data-source';
@Component({
    selector: 'form-renderer',
    templateUrl: 'form-renderer.component.html',
    styles: [DEFAULT_STYLES],
    animations: [
        trigger('flyIn', [
            state('in', style({ transform: 'translateX(0)' })),
            transition('void => *', [
                style({ transform: 'translateX(100%)' }),
                animate(250)
            ])
        ])
    ]
})
export class FormRendererComponent implements OnInit, AfterViewChecked, OnDestroy {

    @Input() node: NodeBase;
    @Input() parentGroup: AfeFormGroup;
    showTime: boolean;
    showWeeks: boolean;
    activeTab: number;
    $owlElement: any;
    dataSource: DataSource;
    @ViewChild('slick') slick;

    constructor(private validationFactory: ValidationFactory, private dataSources: DataSources) {
        this.activeTab = 0;
    }

    ngOnInit() {
        this.setShowTimeAndWeeks();
        this.setUpRemoteSelect();
    }
    setUpRemoteSelect() {
        if (this.node && this.node.question.extras && this.node.question.renderingType === 'remote-select') {
            this.dataSource = this.dataSources.dataSources[this.node.question.dataSource];
        }
    }
    setShowTimeAndWeeks() {
        if (this.node.question.extras && this.node.question.extras['questionOptions']) {
            this.showTime = this.node.question.extras['questionOptions']['showTime'];
            this.showWeeks = this.node.question.extras['questionOptions']['showWeeks'];
        }
    }

    ngAfterViewChecked(): void {
        this.$owlElement = this.slick && this.slick.nativeElement ?
            (<any>$(this.slick.nativeElement)).not('.slick-initialized').slick({
                dots: false,
                infinite: false,
                speed: 300,
                slidesToShow: 4,
                slidesToScroll: 1,
                focusOnSelect: true,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                            infinite: true,
                            dots: false
                        }
                    },
                    {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                    // You can unslick at a given breakpoint now by adding:
                    // settings: "unslick"
                    // instead of a settings object
                ]
            }
            ) : null;

    }
    ngOnDestroy() {
        if (this.$owlElement && this.$owlElement.unslick) { this.$owlElement.unslick(); }
        this.$owlElement = null;
    }

    clickTab(tabNumber) {
        this.activeTab = tabNumber;
        // console.log(tabNumber);
    }

    hasErrors() {
        return this.node.control.touched && !this.node.control.valid;
    }

    errors() {
        return this.getErrors(this.node);
    }

    private getErrors(node: NodeBase) {
        let errors: any = node.control.errors;

        if (errors) {

            return this.validationFactory.errors(errors, node.question);
        }

        return [];
    }

}
